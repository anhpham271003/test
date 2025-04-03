const authPage = (premission) => {
  return (req, res, next) => {
    if (!userid) {
      return res.status(403).json("Vui lòng đăng nhập!!");
    }
    const { user } = {
      user: {
        name: "",
        role: ["ADM", "MOD"],
      },
    };
    if (!user) {
      return res.status(403).josn("Tài khoản không hợp lệ!!");
    }
    const { role } = user;
    if (!premission?.includes(role)) {
      return res
        .status(403)
        .json("Bạn không có quyền truy cập vào tài nguyên này!!");
    }
    next();
  };
};

module.exports = { authPage };
