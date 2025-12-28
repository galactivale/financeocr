// 404 Not Found middleware
const notFound = (req, res, next) => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/f13a3136-6c29-48a7-9d78-4874aa5a8376',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'notFound.js:2',message:'Route not found',data:{method:req.method,path:req.path,originalUrl:req.originalUrl,baseUrl:req.baseUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = notFound;
