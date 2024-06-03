# Step-by-step for development API

## Setup de Husky e Lint-Staged

### Parte 1: Instalar Husky

Primeiro, instale o Husky:

```bash
$ npm install husky --save-dev

$ npm i husky -D
```

### Parte 2: Inicializar o Husky

Inicialize o Husky para configurar os hooks de Git:

```bash
$ npx husky install
```

Adicione o script `prepare` no seu `package.json`:

```json
"scripts": {
  "prepare": "husky install"
}
```

### Parte 3: Instalar Lint-Staged

Agora, instale o lint-staged:

```bash
$ npm install lint-staged --save-dev

$ npm i lint-staged -D
```

### Parte 4: Configurar Lint-Staged

Adicione a configuração do lint-staged no seu `package.json` para rodar os linters nos arquivos que estão sendo cometidos:

```json
"lint-staged": {
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ]
}
```

### Parte 5: Instalar Commitlint

Instale as dependências do commitlint:

```bash
$ npm install @commitlint/config-conventional @commitlint/cli --save-dev

$ npm i @commitlint/config-conventional @commitlint/cli -D
```

### Parte 6: Configurar Commitlint

Crie um arquivo `commitlint.config.js` na raiz do seu projeto e adicione a seguinte configuração:

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat',
      'fix',
      'chore',
      'docs',
      'style',
      'refactor',
      'perf',
      'test'
    ]],
    'subject-case': [0, 'never']
  }
};
```

### Parte 7: Adicionar Hooks do Husky

Adicione os hooks do Husky para verificar o lint e validar as mensagens de commit:

1. Hook `pre-commit` para rodar lint-staged:

```bash
$ npx husky add .husky/pre-commit "npx lint-staged"
```

2. Hook `commit-msg` para validar a mensagem de commit:

```bash
$ npx husky add .husky/commit-msg "npx --no-install commitlint --edit $1"
```

### Parte 8: Adicionar Hook para Testes

Se você quiser rodar testes antes de cada commit, adicione o comando para rodar os testes no hook `pre-commit`. Abra o arquivo `.husky/pre-commit` e adicione o comando para rodar os testes:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
npm run lint
npm test
```

### Parte 9: Verificar a Configuração

Certifique-se de que tudo está configurado corretamente fazendo um commit de teste:

1. Faça uma alteração em algum arquivo.
2. Adicione as mudanças ao stage com `git add`.
3. Tente fazer um commit com `git commit -m "feat: teste do Husky"`.

Se tudo estiver configurado corretamente, o Husky deve rodar os linters, os testes e verificar a mensagem do commit antes de permitir que o commit seja realizado.