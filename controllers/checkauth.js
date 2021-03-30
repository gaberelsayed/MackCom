module.exports = (req,res,next)=>{
    if(!req.session.user){
         req.flash("error","Please login to continue");
         req.session.redirect = req.originalUrl;
         return res.status(401).redirect('/auth');
    }
    next();
}