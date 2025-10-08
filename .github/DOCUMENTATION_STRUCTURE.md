# 📝 Nota Importante - Organização de Documentação

## ⚠️ ATENÇÃO DESENVOLVEDORES

### 🗂️ Estrutura de Documentação

A partir de **outubro de 2025**, toda a documentação do projeto está organizada na pasta `docs/` com estrutura hierárquica.

**REGRA FUNDAMENTAL:**
> ✅ **APENAS o `README.md` fica na raiz do projeto**
>
> ❌ **TODOS os outros arquivos Markdown vão em `docs/`**

---

## 📁 Estrutura Atual

``` text
projeto-raiz/
├── README.md                          # ✅ ÚNICO arquivo MD na raiz
│
└── docs/                              # 📚 Toda a documentação
    ├── README.md                      # Índice principal da documentação
    ├── CHANGELOG.md                   # Histórico de versões
    │
    ├── contributing/                  # Guias para contribuidores
    │   ├── CONTRIBUTING.md           # Como contribuir
    │   └── I18N.md                   # Internacionalização
    │
    ├── development/                   # Documentação de desenvolvimento
    │   ├── TODO.md                   # Roadmap e tarefas
    │   └── TESTING.md                # Guia de testes
    │
    └── releases/                      # Documentação de releases
        ├── RELEASE_NOTES_v0.2.0.md   # Notas da v0.2.0
        ├── GITHUB_RELEASE_v0.2.0.md  # Template GitHub v0.2.0
        └── RELEASE_SUMMARY.md        # Resumo do release
```

---

## 📋 Onde Criar Novos Arquivos Markdown

| Tipo de Documento | Pasta | Exemplo |
|-------------------|-------|---------|
| Guia de usuário | `docs/` | `docs/USER_GUIDE.md` |
| Guia de contribuição | `docs/contributing/` | `docs/contributing/CODE_STYLE.md` |
| Documentação técnica | `docs/development/` | `docs/development/ARCHITECTURE.md` |
| Release notes | `docs/releases/` | `docs/releases/RELEASE_NOTES_v0.3.0.md` |
| Tutoriais | `docs/tutorials/` | `docs/tutorials/CUSTOM_THEMES.md` |
| API Reference | `docs/api/` | `docs/api/API_REFERENCE.md` |

---

## ✅ Checklist ao Adicionar Documentação

Quando criar qualquer novo arquivo Markdown:

- [ ] Arquivo criado na pasta apropriada dentro de `docs/`
- [ ] Link adicionado ao `docs/README.md` (índice principal)
- [ ] Cross-references atualizadas em documentos relacionados
- [ ] Caminho relativo correto (usar `../` quando necessário)
- [ ] Exemplos incluídos quando apropriado
- [ ] Tradução considerada (adicionar nota ao I18N.md se aplicável)
- [ ] Seção atualizada no CHANGELOG se for mudança significativa

---

## 🚫 O Que NÃO Fazer

### ❌ NUNCA faça isso

```text
projeto-raiz/
├── README.md
├── SOME_NEW_DOC.md          # ❌ ERRADO! Não criar MD na raiz
├── ANOTHER_GUIDE.md         # ❌ ERRADO! Documentação vai em docs/
└── docs/
    └── ...
```

### ✅ SEMPRE faça assim

```text
projeto-raiz/
├── README.md                 # ✅ Único MD na raiz
└── docs/
    ├── SOME_NEW_DOC.md      # ✅ CORRETO!
    └── guides/
        └── ANOTHER_GUIDE.md  # ✅ CORRETO!
```

---

## 🔄 Migrando Documentação Antiga

Se você encontrar arquivos Markdown na raiz (exceto README.md):

1. **Identifique o tipo** do documento
2. **Mova para a pasta apropriada** em `docs/`
3. **Atualize todos os links** que referenciam o arquivo
4. **Teste todos os links** (procurar por `grep -r "NOME_ARQUIVO.md" .`)
5. **Adicione ao índice** em `docs/README.md`
6. **Commit** com mensagem descritiva

---

## 🎯 Benefícios desta Organização

✅ **Navegação clara**: Estrutura hierárquica intuitiva
✅ **Escalabilidade**: Fácil adicionar novos documentos
✅ **Raiz limpa**: Projeto root mais organizado
✅ **Separação clara**: Código vs Documentação
✅ **Manutenção**: Mais fácil encontrar e atualizar docs
✅ **Profissionalismo**: Estrutura padrão de projetos open-source

---

## 📚 Links para Documentação

- [Índice Principal da Documentação](../docs/README.md)
- [Guia de Contribuição](../docs/contributing/CONTRIBUTING.md)
- [I18N - Internacionalização](../docs/contributing/I18N.md)
- [TODO & Roadmap](../docs/development/TODO.md)

---

## 🆘 Dúvidas?

Se tiver dúvidas sobre onde criar documentação:

1. Verifique `docs/README.md` para estrutura atual
2. Procure por documentos similares existentes
3. Em caso de dúvida, crie em `docs/` (raiz da pasta de docs)
4. Pode sempre reorganizar depois se necessário

---

**Última Atualização:** Outubro 2025  
**Responsável:** Organização implementada durante desenvolvimento v0.2.0

---

## **LEMBRE-SE: Documentação organizada = Projeto profissional! 🚀**
