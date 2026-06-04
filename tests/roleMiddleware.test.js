// tests/roleMiddleware.test.js
process.env.NODE_ENV = 'test';

const rolIzinVer = require('../middleware/roleMiddleware');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
};

describe('rolIzinVer()', () => {
  test('kullanici yoksa 401 doner', () => {
    const middleware = rolIzinVer('sistem_yoneticisi');
    const req  = {};
    const res  = mockRes();
    const next = jest.fn();
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('yetkisiz rol 403 doner', () => {
    const middleware = rolIzinVer('sistem_yoneticisi');
    const req  = { kullanici: { rol: 'isveren' } };
    const res  = mockRes();
    const next = jest.fn();
    middleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test('izinli rol next() cagirir', () => {
    const middleware = rolIzinVer('sistem_yoneticisi', 'isg_uzmani');
    const req  = { kullanici: { rol: 'isg_uzmani' } };
    const res  = mockRes();
    const next = jest.fn();
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('coklu rol listesinde ilki eşlesir', () => {
    const middleware = rolIzinVer('sistem_yoneticisi', 'isg_uzmani', 'isyeri_hekimi');
    const req  = { kullanici: { rol: 'sistem_yoneticisi' } };
    const res  = mockRes();
    const next = jest.fn();
    middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
