// module.exports = (requiredRoles) => (req, res, next) => {
//   if (!req.isAuthenticated()) {
//     return res.redirect('/login');
//   }

//   const userRoles = req.user.roles; // Assuming roles are stored in the user object

//   if (!userRoles || !userRoles.some(role => requiredRoles.includes(role))) {
//     return res.status(403).send('Unauthorized');
//   }

//   next();
// };