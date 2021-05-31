let _ref;
function Student(name, age) {
  this.name = name;
  this.age = age;
  
  debugger;
  console.log(this);
  _ref = this;

  return { a: 1 };
}

const NewStudent = Student.bind({ a: 1 });

const stu = new NewStudent('name', 18);
console.log(_ref, stu, _ref === stu);
