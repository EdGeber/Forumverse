export class Aluno {
	constructor(
		public nome: string = "",
		public cpf: string = "",
		public email: string = "") {}
  }

export class AlunoServiceRefatorado {
  alunos: Aluno[] = [];
  
  gravar(aluno: Aluno): Aluno | null {
    var result = null;
    if (this.cpfNaoCadastrado(aluno.cpf)) {
      this.alunos.push(aluno);
      result = aluno;
    }
    return result;
  }
  cpfNaoCadastrado(cpf: string): boolean {
     return !this.alunos.find(a => a.cpf == cpf);
  }
}

export class AlunoServiceOriginal {
	alunos: Aluno[] = [];
	
	gravar(aluno: Aluno): Aluno | null {
	  var result = null;
	  if (!this.alunos.find(a => a.cpf == aluno.cpf)) {
		this.alunos.push(aluno);
		result = aluno;
	  }
	  return result;
	}
}
