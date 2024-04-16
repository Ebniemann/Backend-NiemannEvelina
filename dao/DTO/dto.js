export class usuarioDto {
  constructor(usuario) {
    this.name = usuario.nombre;
    this.email = usuario.email;
    this.rol = usuario.rol;
  }
}
