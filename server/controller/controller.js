const { user, vendor, admin, order, menu, basket, review } = require('../model/model');
const { ObjectId } = require('mongodb');

//register user
exports.reguser = async (req, res) => {
    if (!req.body) {
        res
            .status(400).send({ message: "Content cannot be empty!" });
        return;
    }

    const newuser = new user({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        phoneNumber: req.body.phoneNumber,
        role: req.body.role,
    });

    newuser
        .save(newuser)
        .then(data => {
            res.redirect('/reguser');
        })
        .catch(err => {
            res.status(500)
                .render('error', {
                    message: err.message || 'Some error occured  while creating a create operation',
                });
        });
}

//register vendor
exports.regvendor = async (req, res) => {
    if (!req.body) {
        res
            .status(400).send({ message: "Content cannot be empty!" });
        return;
    }

    const newvendor = new vendor({
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        phoneNumber: req.body.phoneNumber,
        canteenName: req.body.canteenName,
        addressOrDescription: req.body.addOrDesc,
        terms: (req.body.terms === 'on'),
        qrCode: req.body.qrCode,
    });

    newvendor
        .save(newvendor)
        .then(data => {
            res.redirect('/regvendor');
        })
        .catch(err => {
            res.status(500)
                .render('error', {
                    message: err.message || 'Some error occured while creating a create operation',
                });
        });
}

//implement login functionality
exports.afterlogin = async (req, res) => {
    const email = req.body.email;
    const role = req.body.role;
    const password = req.body.password;

    if (role == "Student" || role == "Professor") {

        await user.find({ email: email })
            .then((data) => {
                if (!data) {
                    res
                        .status(404)
                        .render('error', { message: `Not found user with email: ${email} ` });
                }
                else if (data[0].role != role) {
                    res.status(500)
                        .render('error', { message: `Invalid Role` });
                }
                else if (password != data[0].password) {
                    res
                        .status(500)
                        .render('error', { message: `Password Invalid` });
                    return;
                }
                else {

                    vendor.find({ status: "Approved" })
                        .then((dataven) => {

                            res.render('userhome', { bodydata: { data: dataven, id: data[0]._id } })
                        })
                        .catch((err) => {
                            res
                                .status(500)
                                .render('error', { message: `Some error occured` });
                        })
                }

            })
            .catch((err) => {
                // 
                res
                    .status(500)
                    .render('error', { message: `${err}` || `Error retrieving user with email ${email}` });
            });
    }
    else if (role == "Admin") {
        await admin.find({ email: email })
            .then((data) => {
                if (!data) {
                    res
                        .status(404)
                        .render('error', { message: `Not found user with email: ${email} ` });
                }
                else if (password != data[0].password) {
                    res
                        .status(500)
                        .render('error', { message: `Password Invalid` });
                    return;
                }
                else res.render('adminhome');

            })
            .catch((err) => {
                res
                    .status(500)
                    .render('error', { message: `Error retrieving user with email ${email}` });
            });
    }
    else if (role == "Vendor") {
        await vendor.find({ email: email, status: "Approved" })
            .then((data) => {
                if (!data) {
                    res
                        .status(404)
                        .render('error', { message: `Not found user with email: ${email} ` });
                }
                else if (password != data[0].password) {
                    res
                        .status(500)
                        .render('error', { message: `Password Invalid` });
                    return;
                }
                else {
                    order.find({ canteenId: data[0]._id, status: "Pending" })
                        .then(datao => {
                            res.render('vendorhome', { object: { id: data[0]._id, name: data[0].canteenName, bval: data[0].bar, orderdata: datao } });
                        })
                        .catch(err => {
                            res
                                .status(500)
                                .render('error', { message: `${err}` || `Error occured retrieving order data` });
                        })

                }

            })
            .catch((err) => {
                res
                    .status(500)
                    .render('error', { message: `Error retrieving user with email ${email}` });
            });
    }
    else {
        res
            .status(500)
            .render('error', { message: `Some error occured` });
    }
}


//change bar value
exports.changebar = async (req, res) => {
    if (!req.body) {
        res
            .status(500)
            .render('error', { message: `Data of update id is empty` });
    }
    const id = req.params.id;
    vendor.findByIdAndUpdate(id, { $set: { bar: req.body.bar } }, { new: true })
        .then(data => {
            if (!data) {
                res
                    .status(500)
                    .render('error', { message: `Object not found` });
            }
            else {

                order.find({ canteenId: id, status: "Pending" })
                    .then(datao => {
                        res.render('vendorhome', { object: { id: id, bval: req.body.bar, name: data.canteenName, orderdata: datao } });
                    })
                    .catch(err => {
                        res
                            .status(500)
                            .render('error', { message: `${err}` || `Error occured retrieving order data` });
                    })


            }
        })
        .catch((err) => {
            res
                .status(500)
                .render('error', { message: `${err}` || `Error retrieving data` });
        });
}


//change order status

exports.acceptorder = async (req, res) => {
    if (!req.body) {
        res
            .status(500)
            .render('error', { message: `Data of id is empty` });
    }
    const id = req.params.id;
    order.findByIdAndUpdate(id, { $set: { status: "Accepted" } }, { new: true })
        .then(data => {
            if (!data) {
                res
                    .status(500)
                    .render('error', { message: `Object not found` });
            }
            else {

                order.find({ canteenId: data.canteenId, status: "Pending" })
                    .then(datao => {
                        vendor.findOne({ _id: data.canteenId })
                            .then(vendoro => {
                                res.render('vendorhome', { object: { id: vendoro._id, bval: vendoro.bar, name: vendoro.canteenName, orderdata: datao } });
                            })
                            .catch(err => {
                                res
                                    .status(500)
                                    .render('error', { message: `${err}` || `Error retrieving data` });
                            });
                    })
                    .catch(err => {
                        res
                            .status(500)
                            .render('error', { message: `${err}` || `Error retrieving data` });
                    })



            }
        })
        .catch((err) => {
            res
                .status(500)
                .render('error', { message: `${err}` || `Error retrieving data` });
        });
}

//reject order
exports.rejectorder = async (req, res) => {
    if (!req.body) {
        res
            .status(500)
            .render('error', { message: `Data of id is empty` });
    }
    const id = req.params.id;
    order.findByIdAndUpdate(id, { $set: { status: "Rejected" } }, { new: true })
        .then(data => {
            if (!data) {
                res
                    .status(500)
                    .render('error', { message: `Object not found` });
            }
            else {

                order.find({ canteenId: data.canteenId, status: "Pending" })
                    .then(datao => {

                        vendor.findOne({ _id: data.canteenId })
                            .then(vendoro => {
                                res.render('vendorhome', { object: { id: vendoro._id, bval: vendoro.bar, name: vendoro.canteenName, orderdata: datao } });
                            })
                            .catch(err => {
                                res
                                    .status(500)
                                    .render('error', { message: `${err}` || `Error retrieving data` });
                            });
                    })
                    .catch(err => {
                        res
                            .status(500)
                            .render('error', { message: `${err}` || `Error occured retrieving order data` });
                    })


            }
        })
        .catch((err) => {
            res
                .status(500)
                .render('error', { message: `${err}` || `Error retrieving data` });
        });
}

//fucntion for menu
exports.menu = async (req, res) => {
    try {
        const id = req.params.id;

        const vendorData = await vendor.findById(id).exec();
        if (!vendorData) {
            throw new Error('Vendor not found');
        }

        const [vendordata, menudata] = await Promise.all([
            vendor.find({ status: 'Approved' }).exec(),
            menu.find({ canteenId: id }).exec(),
        ]);

        const allCanteenNames = await vendor.distinct('canteenName', {
            status: 'Approved'
        }).exec();

        res.render('canteenmenu', {
            data: {
                vendordata,
                menudata,
                canteenName: vendorData.canteenName,
                allCanteenNames: allCanteenNames
            },
        });
    } catch (err) {
        res.status(500).render('error', { message: err.message || 'Error retrieving data' });
    }
};


// function for daily analysis of vendor
exports.dailyanalysis = async (req, res) => {
    if (!req.body) {
        res.status(500).render('error', { message: `Data of id is empty` });
    }

    const id = req.params.id;
    const objectId = new ObjectId(id);

    order.aggregate([
        {
            $match: {
                canteenId: objectId,
                status: "Accepted",
                $expr: {
                    $eq: [
                        { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                        { $dateToString: { format: "%Y-%m-%d", date: new Date() } }
                    ]
                }
            }
        },
        {
            $group: {
                _id: "$name",
                totalQuantity: { $sum: "$quantity" },
                totalPrice: { $sum: "$price" }
            }
        },
        {
            $group: {
                _id: null,
                data: { $push: { _id: "$_id", totalQuantity: "$totalQuantity", totalPrice: "$totalPrice" } },
                total: { $sum: "$totalPrice" }
            }
        }
    ])
        .exec()
        .then(result => {
            //console.log(result[0].data);
            const data = result.length > 0 ? result[0].data : [];
            const totalPrice = result.length > 0 ? result[0].total : 0;
            res.render('vendordaily', { data: data, totalPrice: totalPrice });
        })
        .catch(err => {
            res.status(500).render('error', { message: `${err}` || 'Error occurred during aggregation' });
        });

};



//function for submit the order
exports.submitorder = async (req, res) => {
    const menuItems = req.body.menu;

    const userId = new ObjectId(req.body.userId);

    const processedItems = menuItems.map(item => ({
        itemId: item.itemId,
        quantity: parseInt(item.quantity),
    }));
    const filteredItems = processedItems.filter(item => item.quantity > 0);

    const itemPromises = filteredItems.map(async item => {
        const menuItem = await menu.findOne({ _id: item.itemId });
        const canteen = await vendor.findOne({ _id: menuItem.canteenId });
        const userd = await user.findOne({ _id: userId });
        const newitem = new basket({
            name: menuItem.name,
            price: menuItem.price,
            quantity: item.quantity,
            canteenId: menuItem.canteenId,
            canteenName: canteen.canteenName,
            qrCode: canteen.qrCode,
            userId: userId,
            role: userd.role,
        });
        await newitem.save();

        return newitem;
    });
    const vendordata = await vendor.find({ status: "Approved" });
    //console.log(vendordata);
    const itemInfo = await Promise.all(itemPromises);
    const userItems = await basket.find({ userId: userId });
    res.render('orderpage', { order: userItems, vendordata: vendordata });
}


//
exports.changep = async (req, res) => {
    try {
        const { id, userId } = req.params;

        const curr = await basket.findOneAndUpdate(
            { _id: id },
            { $inc: { quantity: 1 } },
            { new: true }
        );
        const userItems = await basket.find({ userId });
        const vendordata = await vendor.find({ status: "Approved" });
        res.render('orderpage', { order: userItems, vendordata: vendordata });

    } catch (err) {
        res.status(500).render('error', { message: err.message || 'Error retrieving data' });
    }
}

//
exports.changem = async (req, res) => {
    try {
        const { id, userId } = req.params;

        const curr = await basket.findOneAndUpdate(
            { _id: id },
            { $inc: { quantity: -1 } },
            { new: true }
        );
        if (curr.quantity <= 0) {
            await basket.deleteOne({ _id: id });
        }
        const userItems = await basket.find({ userId });
        const vendordata = await vendor.find({ status: "Approved" });
        res.render('orderpage', { order: userItems, vendordata: vendordata });

    } catch (err) {
        res.status(500).render('error', { message: err.message || 'Error retrieving data' });
    }
}



//nandani


// function for monthly analysis of vendor
exports.monthlyanalysis = async (req, res) => {
    try {
        const id = req.params.id;
        const objectId = new ObjectId(id);
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const result = await order.aggregate([
            {
                $match: {
                    canteenId: objectId,
                    status: "Accepted",
                    date: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: "$name",
                    totalQuantity: { $sum: "$quantity" },
                    totalPrice: { $sum: "$price" }
                }
            },
            {
                $group: {
                    _id: null,
                    data: { $push: { _id: "$_id", totalQuantity: "$totalQuantity", totalPrice: "$totalPrice" } },
                    total: { $sum: "$totalPrice" }
                }
            }
        ]).exec();

        const data = result.length > 0 ? result[0].data : [];
        const totalPrice = result.length > 0 ? result[0].total : 0;
        res.render('vendormonthly', { data: data, totalPrice: totalPrice });
    } catch (err) {
        res.status(500).render('error', { message: `${err}` || 'Error occurred during aggregation' });
    }
};


//function for orderHistory of user
// exports.orderHistory = async (req, res) => {
//     const id = req.params.id;//here id = userid
//     try {

//         const orderData = await order.find({ userId: id }).sort({ date: -1 });
//         //const filteredOrderData = orderData.filter(order => order.status !== 'Pending');
//         res.render('orderHistory', { orderData: orderData, id: id });

//     } catch (err) {
//         res.status(500).render('error', { message: err.message || 'Error retrieving data' });
//     }
// }
exports.orderHistory = async (req, res) => {
    const id = req.params.id; // here id = userid
    try {
        const vendordata = await vendor.find({ status: "Approved" });

        const orderData = await order.find({ userId: id }).sort({ date: -1 });
        //const filteredOrderData = orderData.filter(order => order.status !== 'Pending');
        res.render('orderHistory', { orderData: orderData, id: id, vendordata: vendordata });
    } catch (err) {
        res.status(500).render('error', { message: err.message || 'Error retrieving data' });
    }
};


// daily analysis of user
exports.dailyanalysisuser = async (req, res) => {
    const id = req.params.id;
    try {
        const vendordata = await vendor.find({ status: "Approved" });
        const currentDate = new Date().toISOString().split('T')[0];
        const orderData = await order.find({ userId: id, date: { $gte: currentDate } });
        const filteredOrderData = orderData.filter(order => order.status !== 'Pending');
        res.render('dailyanalysisuser', { orderData: filteredOrderData, id: id, vendordata: vendordata });
    } catch (err) {
        res.status(500).render('error', { message: err.message || 'Error retrieving data' });
    }
};



//monthly analysis of user
exports.monthlyanalysisuser = async (req, res) => {
    const id = req.params.id;
    try {

        const currentDate = new Date();

        const vendordata = await vendor.find({ status: "Approved" });
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const orderData = await order.find({
            userId: id,
            date: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }
        });
        const filteredOrderData = orderData.filter(order => order.status !== 'Pending').sort((a, b) => b.date - a.date);

        res.render('monthlyanalysisuser', { orderData: filteredOrderData, id: id, vendordata: vendordata });
    } catch (err) {
        res.status(500).render('error', { message: err.message || 'Error retrieving data' });
    }
};

//to add review in database
exports.afteraddreview = async (req, res) => {

    const newreview = new review({
        title: req.body.title,
        description: req.body.description,
        rating1: req.body.rating1,
        rating2: req.body.rating2,
        rating3: req.body.rating3,
        status: req.body.status,
    });
    // Save the data to the database
    const id = req.body.id;//id=userid
    newreview
        .save(newreview)
        .then(data => {
            vendor.find({ status: "Approved" })
                .then((data) => {
                    res.render('userhome', { bodydata: { data: data, id: id } });
                })
                .catch((err) => {
                    res
                        .status(500)
                        .render('error', { message: `Some error occured` });
                })
        })
        .catch(err => {
            res.status(500)
                .render('error', {
                    message: err.message || 'Some error occured  while creating a create operation',
                });
        });
}

//see the review on reviewmain page
exports.reviewshow = async (req, res) => {

    try {
        const reviews = await review.find();
        const vendordata = await vendor.find({ status: "Approved" });

        res.render('reviewmain', { reviews, vendordata: vendordata });
    } catch (error) {
        console.log('Error retrieving reviews:', error);
        res.render('error');
    }

}

//see the review for admin
exports.reviewshowforadmin = async (req, res) => {

    try {
        const reviews = await review.find();
        res.render('reviewsadmin', { reviews });
    } catch (error) {
        console.log('Error retrieving reviews:', error);
        res.render('error');
    }
}

//see the data of the vendor
exports.formdata = async (req, res) => {
    vendor.find()
        .then((vendors) => {
            res.render('vendorform', { vendors });
        })
        .catch((error) => {
            console.log('Error retrieving vendors:', error);
            res.render('error');
        })

}

// Accept review of user in admin
exports.accept = async (req, res) => {

    const reviewId = req.body.reviewId;

    review.findByIdAndUpdate(reviewId, { $set: { status: "Done" } })
        .then(data => {
            if (!data) {
                res
                    .status(500)
                    .render('error', { message: `Object not found` });
            }
            else {
                res.render('adminhome');
            }
        });

}

// Reject review of user in admin
exports.reject = async (req, res) => {
    const reviewId = req.body.reviewId;

    review.findByIdAndUpdate(reviewId, { $set: { status: "Reject" } })
        .then(data => {
            if (!data) {
                res
                    .status(500)
                    .render('error', { message: `Object not found` });
            }
            else {
                res.render('adminhome');
            }
        });

}

//approve vendor in admin
exports.approve = async (req, res) => {
    const vendorId = req.body.vendorId;

    vendor.findByIdAndUpdate(vendorId, { $set: { status: "Approved" } })
        .then(data => {
            if (!data) {
                res
                    .status(500)
                    .render('error', { message: `Object not found` });
            }
            else {
                res.render('adminhome');
            }
        });


}

//reject vendor in admin
exports.rejected = async (req, res) => {
    const vendorId = req.body.vendorId;

    vendor.findByIdAndUpdate(vendorId, { $set: { status: "Rejected" } })
        .then(data => {
            if (!data) {
                res
                    .status(500)
                    .render('error', { message: `Object not found` });
            }
            else {
                res.render('adminhome');
            }
        });
}


//Nandani




//function for reorder in orderhistory of user
exports.reorder = async (req, res) => {
    try {
        const id = req.params.id.trim();//id = order id
        const objectId = new ObjectId(id);
        // console.log(id);
        const ReOrder = await order.findOne({ _id: objectId });

        const token = generateToken();
        const newOrder = new order({
            name: ReOrder.name,
            price: ReOrder.price,
            quantity: ReOrder.quantity,
            token: token,
            status: "Pending",
            canteenId: ReOrder.canteenId,
            userId: ReOrder.userId,
            date: new Date(),
            role: ReOrder.role,
            canteenName: ReOrder.canteenName,
            qrCode: ReOrder.qrCode,
            delivery: "No",
        });

        // Save the new order to the database
        const savedOrder = await newOrder.save();

        res.render('success', { message: `Order Successful with token : ${token}` });
    } catch (err) {
        res.render('error', { message: err || 'Error occurred' });
    }

}
//placeorder function
exports.finalorder = async (req, res) => {
    try {
        const id = req.params.id;

        const basketOrders = await basket.find({ userId: id });

        await basket.deleteMany({ userId: id });

        const transformedOrders = [];
        const token = generateToken();
        let userId = id;
        let delivery = 'No';
        if (req.body.delivery && req.body.address) {
            delivery = req.body.address;
        }
        if (req.body.friend === 'on' && req.body.email) {
            const userd = await user.findOne({ email: req.body.email });

            if (user) {
                userId = userd._id;
            } else {
                res.render('error', { message: ' Friend not found ' });
            }
        }

        // Transform each basket order into an order object
        for (const basketOrder of basketOrders) {
            const { name, price, quantity, canteenId, canteenName, qrCode, role } = basketOrder;

            const orderdata = new order({
                name,
                price: price * quantity,
                quantity,
                canteenId,
                userId,
                canteenName,
                qrCode,
                role,
                date: new Date(),
                token: token,
                status: 'Pending',
                delivery: delivery,
            });

            transformedOrders.push(orderdata);
        }
        await order.create(transformedOrders);


        res.render('success', { message: `Order Successful with token : ${token}` });

    } catch (error) {
        res.render('error', { message: 'Error occurred' });
    }
}
function generateToken() {
    const min = 1000; // Minimum 4-digit number
    const max = 9999; // Maximum 4-digit number

    // Generate a random number within the range
    const token = Math.floor(Math.random() * (max - min + 1)) + min;

    return token;
}

//show menu function

exports.showmenu=async (req, res) => {
    try {
      const canteenId = req.params.id; 
      const menuItems = await menu.find({ canteenId });
  
     
  
    
      res.render('showmenu',{ menuItems,canteenId});
    } catch (error) {
  
      console.error('Error showing canteen menu:', error);
      res.status(500).json({ message: 'An error occurred while showing the canteen menu.' });
    }
  };
// back from show menu
exports.backfromshowmenu = async(req,res)=>{
    const id = req.params.id;
    vendor.find({ _id:id})
    .then((dataven) => {

        order.find({ canteenId: id, status: "Pending" })
                        .then(datao => {
                            res.render('vendorhome', { object: { id: id, name: dataven[0].canteenName, bval: dataven[0].bar, orderdata: datao } });
                        })
                        .catch(err => {
                            res
                                .status(500)
                                .render('error', { message: `${err}` || `Error occured retrieving order data` });
                        })
    })
    .catch((err) => {
        res
            .status(500)
            .render('error', { message: `Some error occured` });
    })
}
//delete menu item
exports.deletemenuitem = async(req,res)=>{
    try {
        //const { id, canteenId } = req.params;
        const id = req.params.id;
        const canteenId = req.params.canteenId;
        
        await menu.deleteOne({ _id: id });
        
        res.redirect('/showmenu/'+canteenId);

    } catch (err) {
        res.status(500).render('error', { message: err.message || 'Error retrieving data' });
    }
   
}
//after show menu
exports.addmenurender= async(req, res) => {
    const canteenId = req.params.id; 

   
    res.render('addmenu', { canteenId });
};

//add menu item
exports.addmenu= async (req, res) => {
    try {
        const canteenId = req.params.id;
        const { name, price, time, category } = req.body;
        const newMenu = new menu({
          canteenId,
          name,
          price,
          time,
          category
        });
        const savedMenu = await newMenu.save();
        const menuItems = await menu.find({ canteenId });     
        res.render('showmenu',{ menuItems,canteenId});
     
      } catch (error) {
     
        console.error('Error adding menu item:', error);
        res.status(500).json({ message: 'An error occurred while adding the menu item.' });
      }
  };
  

  //fetch item details
  exports.menuItemDetails = async (req, res) => {
    try {
        const itemId = req.params.itemId;

        // Fetch the menu item details using the itemId
        const menuItem = await menu.findById(itemId).exec();

        if (!menuItem) {
            throw new Error('Menu item not found');
        }

        res.render('menuitemdetails', { menuItem });
    } catch (err) {
        res.status(500).render('error', { message: err.message || 'Error retrieving menu item details' });
    }
};
  
  
  