# Step-by-step for development API

## GitFlow

### Parte 1: Introdução ao GitFlow

- GitFlow é uma metodologia de ramificação para usar com Git que facilita o gerenciamento de projetos e fluxos de trabalho de desenvolvimento.

- Introduzido por Vincent Driessen em 2010, GitFlow usa duas branches principais: `master` e `develop`, juntamente com branches de suporte como `feature`, `release`, e `hotfix`.

### Parte 2: Instalação do GitFlow

- Antes de começar a usar o GitFlow, você precisa instalá-lo.

- No Linux:

```bash
$ sudo apt-get install git-flow
```

- No macOS com Homebrew:

```bash
$ brew install git-flow-avh
```

- No Windows, pode ser instalado via Git Bash ou usando ferramentas como `choco`:

```bash
$ choco install git-flow-avh
```

### Parte 3: Inicialização do GitFlow

- No repositório Git, inicialize o GitFlow:

```bash
$ git flow init
```

- Durante a inicialização, você será solicitado a configurar os nomes das branches e tags. Os nomes padrões geralmente são suficientes:
  - Branch de produção: `master`
  - Branch de desenvolvimento: `develop`
  - Prefixo para branches de feature: `feature/`
  - Prefixo para branches de release: `release/`
  - Prefixo para branches de hotfix: `hotfix/`
  - Prefixo para tags: `v`

### Parte 4: Criando e Trabalhando com Branches de Feature

- Para iniciar uma nova feature:

```bash
$ git flow feature start <nome-da-feature>
```

- Desenvolva suas mudanças na branch de feature.

- Após finalizar a feature, finalize-a e mescle-a de volta na branch `develop`:

```bash
$ git flow feature finish <nome-da-feature>
```

### Parte 5: Criando e Trabalhando com Branches de Release

- Quando a branch `develop` está pronta para um novo lançamento, inicie uma branch de release:

```bash
$ git flow release start <versão>
```

- Faça os testes e ajustes necessários na branch de release.

- Finalize a release, mesclando-a nas branches `master` e `develop`, e crie uma tag:

```bash
$ git flow release finish <versão>
```

### Parte 6: Criando e Trabalhando com Branches de Hotfix

- Para corrigir bugs críticos na branch `master`, inicie uma branch de hotfix:

```bash
$ git flow hotfix start <nome-do-hotfix>
```

- Aplique as correções necessárias.

- Finalize o hotfix, mesclando-o nas branches `master` e `develop`, e crie uma tag:

```bash
$ git flow hotfix finish <nome-do-hotfix>
```

### Parte 7: Dicas e Melhores Práticas

- <b>Commits Descritivos</b>: Escreva mensagens de commit claras e descritivas.

- <b>Sincronização Regular</b>: Regularmente puxe as últimas mudanças da branch develop para evitar conflitos.

- <b>Revisões de Código</b>: Utilize pull requests e revisões de código para manter a qualidade do código.

- <b>Automatização</b>: Considere automatizar testes e integrações contínuas com ferramentas CI/CD.

### Parte 8: Comandos GitFlow Essenciais

- Iniciar GitFlow:

```bash
$ git flow init
```

- Iniciar uma feature:

```bash
$ git flow feature start <nome-da-feature>
```

- Finalizar uma feature:

```bash
$ git flow feature finish <nome-da-feature>
```

- Iniciar uma release:

```bash
$ git flow release start <versão>
```

- Finalizar uma release:

```bash
$ git flow release finish <versão>
```

- Iniciar um hotfix:

```bash
$ git flow hotfix start <nome-do-hotfix>
```

- Finalizar um hotfix:

```bash
$ git flow hotfix finish <nome-do-hotfix>
```

### Parte 9: Recursos Adicionais

- [Documentação Oficial do GitFlow](https://www.alura.com.br/artigos/git-flow-o-que-e-como-quando-utilizar)
- [Post Original de Vincent Driessen](https://nvie.com/posts/a-successful-git-branching-model/)
- [Ferramentas e Plugins para Integração com IDEs](https://marketplace.visualstudio.com/items?itemName=vector-of-bool.gitflow)

<br />

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