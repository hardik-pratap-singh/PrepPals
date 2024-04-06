const getPrivateData = (req, res, next) => {
  return res.status(200).json({
    success: true
  });
};

module.exports = { getPrivateData };
