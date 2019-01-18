class TemplateRes {
  constructor({
    ideTercero = undefined,
    indRechazoPrev = undefined,
    paisOrigen = undefined,
    ideRolPrimario = undefined,
    codTercero = undefined,
    fecCreacion = undefined,
    usuCreacion = undefined,
    idpTipoTercero = undefined,
    fecModif = undefined,
    usuModif = undefined,
    idPsegmer = undefined,
    ideActEconomica = undefined,
    ideNombrePrincipal = undefined,
    indMigrado = undefined,
    nomCompleto = undefined,
  }) {
    this.ideTercero = ideTercero;
    this.indRechazoPrev = indRechazoPrev;
    this.paisOrigen = paisOrigen;
    this.ideRolPrimario = ideRolPrimario;
    this.codTercero = codTercero;
    this.fecCreacion = fecCreacion;
    this.usuCreacion = usuCreacion;
    this.idpTipoTercero = idpTipoTercero;
    this.fecModif = fecModif;
    this.usuModif = usuModif;
    this.idPsegmer = idPsegmer;
    this.ideActEconomica = ideActEconomica;
    this.ideNombrePrincipal = ideNombrePrincipal;
    this.indMigrado = indMigrado;
    this.nomCompleto = nomCompleto;
  }
}

module.exports = TemplateRes;
