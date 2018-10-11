exports.myMiddleware = (req, res, next) =>{
  req.name = "Abhinav";
  next();
};

exports.homepage = (req, res) => {
  console.log(req.name);
  res.render('index', {title: 'Dang'});
};
