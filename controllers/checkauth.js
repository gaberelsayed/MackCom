module.exports = (req,res,next)=>{
    if(!req.session.user){
         req.flash("error","Please login to continue");
         return res.status(401).redirect('/');
    }
    next();
}