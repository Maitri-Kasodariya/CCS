
exports.home = (req, res) =>
{
    res.render('mainhome');
};
exports.login = (req, res) =>
{
    res.render('loginpage');
};
exports.reguser = (req, res) =>
{
    res.render('reg_as_user');
};
exports.regvendor = (req, res) =>
{
    res.render('reg_as_vendor');
};
exports.signup = (req, res) =>
{
    res.render('signuppage');
};
exports.addreview =(req,res)=>
{
    res.render('addreviewpage');
};

