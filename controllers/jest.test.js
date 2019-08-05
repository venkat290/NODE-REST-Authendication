jest.mock('node-fetch')
const { sum } = require('../controllers/con-home');
const { fetchAPI } = require('../util');
//jest.setTimeout(30000);
test('sum details',()=>{
    expect(sum(1,2)).toBe(3);
})
test('Get User Details With API',()=>{
  return fetchAPI().then(data=>{
      expect(data).toEqual({});
      done();
  })
})
// //Database Test is Still Pending
// test('Get User Details From Database',()=>{
//   return getUsers().then(data=>{
//       expect(data).toEqual({});
//       done();
//   })
// })