module.exports.EXECUTE_QUERY_ORACLE = `
  select * from app_iaa_tercero.ter_tercero where idetercero in (:id,14975180,14975181)
`;

module.exports.EXECUTE_PROCEDURE_ORACLE = `
  begin
    app_iaa_tercero.pq_iaa_persona.sp_obt_persona(:ideTercero, :cursor);
  end;
`;

module.exports.EXECUTE_QUERY_ORACLE9I = `
  select 
    distinct r.codramo, r.descramo
  from 
    certificado c, cert_ramo cr, ramo r, cobert_cert cc
  where 
    c.numcert = cr.numcert and
    cr.numcert = cc.numcert and
    c.idepol = cr.idepol and
    cr.idepol = cc.idepol and
    cr.codramocert = cc.codramocert and
    r.codramo = cr.codramocert and
    c.stscert in ('ACT', 'REN') and
    cr.stscertramo in ('ACT', 'REN') and
    cc.stscobert not in ('VAL', 'INC', 'EXC', 'ANU') 
    and c.idepol = :idepol and c.numcert = :numcert
`;

module.exports.EXECUTE_QUERY_MYSQL = `
  select * 
  from 
    APP_IAA_TERCERO.TER_TERCERO 
  where 
    idetercero in (?,2,3)
`;

module.exports.EXECUTE_PARALLEL_QUERY = `
  select * 
  from 
    app_iaa_tercero.ter_tercero 
  where 
    rownum <= 30
`;
