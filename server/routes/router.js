const express = require('express');
const route = express.Router();
const services = require('../services/render');
const controller = require('../controller/controller');


/**
  * @description Root Route
  * @method GET /
  */

route.get('/',services.home);
route.get('/mainhome',services.home);
route.get('/login',services.login)
route.get('/reguser',services.reguser)
route.get('/regvendor',services.regvendor)
route.get('/signup',services.signup)
route.get('/addreview',services.addreview)
route.get('/review',controller.reviewshow)
route.get('/reviewadmin',controller.reviewshowforadmin)
route.get('/vendorform',controller.formdata)
route.get('/announcements',controller.announcementsshow)
route.get('/accountpage/:id',controller.accountpage)
route.get('/vendoraccount/:id',controller.vendoraccountpage)


/**
  * @description API Route
  * @method POST /
  */

route.post('/reguser',controller.reguser);
route.post('/regvendor',controller.regvendor);
route.post('/login',controller.afterlogin);
route.post('/submit',controller.afteraddreview);
route.post('/approve',controller.approve);
route.post('/rejected',controller.rejected);

/**
  * @description functionalities
  * @method POST /
  */
route.post('/changebar/:id',controller.changebar);
route.get('/acceptorder/:id',controller.acceptorder);
route.get('/rejectorder/:id',controller.rejectorder);
route.post('/reject',controller.reject);
route.post('/accept',controller.accept);
route.get('/dailyuser/:id',controller.dailyanalysisuser);
route.get('/monthlyuser/:id',controller.monthlyanalysisuser);
route.get('/menu/:id',controller.menu);
route.get('/dailyanalysis/:id',controller.dailyanalysis);
route.get('/monthlyanalysis/:id',controller.monthlyanalysis);
route.post('/submitorder',controller.submitorder);
route.post('/finalorder/:id',controller.finalorder);
route.get('/changep/:id/:userId',controller.changep);
route.get('/changem/:id/:userId',controller.changem);
route.get('/orderHistory/:id',controller.orderHistory);
route.get('/reorder/:id',controller.reorder);
route.get('/showmenu/:id',controller.showmenu);
route.get('/addmen/:id',controller.addmenurender);
route.post('/canteens/:id/menu/add',controller.addmenu);
route.get('/back/:id',controller.backfromshowmenu);
route.get('/deletemenuitem/:id/:canteenId',controller.deletemenuitem);
route.get('/postannouncementrender/:id',controller.postannouncementrender);
route.post('/postannouncement/:id',controller.postannouncement);
route.get('/reset/:id/:canteenId',controller.resetamount);
route.get('/vendorhomepage/:id',controller.vendorhome);
route.post('/searchAccount/:id',controller.searchAccount);
route.get('/showemployee/:id',controller.showemployee);
route.get('/addemployee/:id',controller.addemployeepage);
route.get('/deleteemployee/:id/:canteenId',controller.deleteemployee);
route.post('/employees/:id/employee/add',controller.addemployee)

route.get('/menu/:id/item/:itemId', controller.menuItemDetails);
// route.post('/api/menuitem/:itemId/addreview', controller.addReview);
// route.post('/api/menuitem/:itemId/addreview', controller.addReview);
route.post('/api/menuitem/:itemId/addreview/:review', controller.addReview);

module.exports = route