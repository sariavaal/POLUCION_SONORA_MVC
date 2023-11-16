import bcrypt from 'bcrypt';

// Hash de contraseña de ejemplo
const hashedPassword1 = await bcrypt.hash('password123', 10);

const usuarioPrueba = [
  {
    nombre: 'Archivaldo',
    apellido: 'Ramirez',
    email: 'archi@example.com',
    telefono: '123456789',
    password: hashedPassword1,
    token: null,
    confirmado: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: 'Hyunjin ',
    apellido: 'skz',
    email: 'skz@gmail.com',
    telefono: '123456789',
    password: hashedPassword1,
    token: null,
    confirmado: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: 'Jiafei',
    apellido: 'Ramirez',
    email: 'jiafei@example.com',
    telefono: '123456789',
    password: hashedPassword1,
    token: null,
    confirmado: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

export default usuarioPrueba;
