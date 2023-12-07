import bcrypt from 'bcrypt';

// Hash de contraseña de ejemplo
const hashedPassword1 = await bcrypt.hash('password123', 10);
const hashedPassword2 = await bcrypt.hash('contrasena555', 10);
const hashedPassword3 = await bcrypt.hash('pasword122', 10);
const hashedPassword4 = await bcrypt.hash('password124', 10);
const hashedPassword5 = await bcrypt.hash('password125', 10);
const hashedPassword6 = await bcrypt.hash('password126', 10);

const usuarioPrueba = [
  {
    nombre: 'Archivaldo',
    apellido: 'Ramirez',
    email: 'archi@example.com',
    telefono: '123456789',
    password: hashedPassword1,
    rol:'user',
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
    password: hashedPassword2,
    rol: 'user',
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
    password: hashedPassword3,
    rol: 'admin',
    token: null,
    confirmado: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: 'Sunmi',
    apellido: 'Lee sun',
    email: 'sunmi@example.com',
    telefono: '15649',
    password: hashedPassword4,
    rol: 'user',
    token: null,
    confirmado: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: 'Seulgi',
    apellido: 'Kang',
    email: 'seulgi@example.com',
    telefono: '123456789',
    password: hashedPassword5,
    rol: 'user',
    token: null,
    confirmado: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    nombre: 'Irene',
    apellido: 'Bae',
    email: 'irene@gmail.com',
    telefono: '5555',
    password: hashedPassword6,
    rol: 'admin',
    token: null,
    confirmado: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default usuarioPrueba;
