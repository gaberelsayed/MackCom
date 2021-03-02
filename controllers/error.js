exports.getError404 = (req,res)=>{
    res.status(404).render("errors/error404.ejs")
  };

exports.getError403 = (err,req,res,next)=>{
  if (err.code !== 'EBADCSRFTOKEN') 
  return next(err);
  res.status(403).render("errors/error403.ejs");
}

exports.getError500 = (err,req,res,next)=>{
  if(err.httpStatusCode != 500)
  return next(err)
  res.status(500).render("errors/error500.ejs");
}