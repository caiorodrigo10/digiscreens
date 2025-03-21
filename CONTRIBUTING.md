# Guia de Contribuição para o DigiScreens

Obrigado pelo interesse em contribuir com o DigiScreens! Este documento fornece diretrizes para contribuir com o projeto.

## Fluxo de Trabalho de Desenvolvimento

1. **Fork e Clone**
   - Faça um fork do repositório para sua conta
   - Clone o fork para sua máquina local
   ```bash
   git clone https://github.com/seu-usuario/digiscreens.git
   cd digiscreens
   ```

2. **Branches**
   - Crie uma branch para sua contribuição
   ```bash
   git checkout -b feature/nome-da-feature
   ```
   - Use prefixos para identificar o tipo de contribuição:
     - `feature/` para novas funcionalidades
     - `fix/` para correções de bugs
     - `docs/` para atualizações de documentação
     - `refactor/` para refatorações de código

3. **Desenvolvimento**
   - Mantenha suas alterações focadas em um único objetivo
   - Siga os padrões de código existentes
   - Escreva testes para novas funcionalidades quando aplicável

4. **Commits**
   - Use mensagens de commit claras e descritivas
   - Siga o padrão de commits convencionais:
   ```
   tipo(escopo): descrição curta
   
   Descrição mais longa, se necessário
   ```
   - Tipos comuns: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

5. **Pull Requests**
   - Atualize sua branch com as alterações mais recentes da branch principal
   ```bash
   git fetch origin
   git rebase origin/main
   ```
   - Envie suas alterações para o seu fork
   ```bash
   git push origin feature/nome-da-feature
   ```
   - Abra um Pull Request para a branch principal do repositório original
   - Descreva claramente o que foi alterado e por quê
   - Referencie issues relacionadas usando `#numero-da-issue`

## Padrões de Código

- **TypeScript**: Siga as boas práticas de TypeScript
- **React**: Use componentes funcionais e hooks
- **Estilo**: Use Tailwind CSS para estilização
- **Formatação**: Mantenha a formatação consistente (use Prettier)
- **Linting**: Siga as regras de ESLint configuradas no projeto

## Testes

- Escreva testes para novas funcionalidades
- Execute os testes localmente antes de enviar um PR
```bash
npm run test
```

## Revisão de Código

- Os Pull Requests serão revisados por mantenedores do projeto
- Esteja aberto a feedback e disposto a fazer ajustes
- Seja respeitoso nas discussões

## Reportando Bugs

- Use o sistema de issues do GitHub
- Descreva claramente o problema
- Inclua passos para reproduzir
- Mencione ambiente, navegador e versões relevantes

## Sugerindo Melhorias

- Use o sistema de issues do GitHub
- Descreva claramente a melhoria proposta
- Explique por que essa melhoria seria útil

## Dúvidas?

Se você tiver dúvidas sobre o processo de contribuição, abra uma issue com a tag "question" ou entre em contato com os mantenedores.

Agradecemos sua contribuição para tornar o DigiScreens melhor!
