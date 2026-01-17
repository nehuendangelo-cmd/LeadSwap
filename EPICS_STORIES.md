# LeadSwap - Epics & User Stories (Dev Sprint)

## Vision
LeadSwap est un agent IA autonome capable de générer, qualifier et enrichir des leads B2B ultra-ciblés en combinant la puissance de recherche neurale (Exa.ai) et la navigation web autonome (Lightpanda), orchestré par Dust.

---

## Epic 1 : AI Lead Discovery (Le "Sourcing")
**Objectif :** Identifier des entreprises cibles via des critères en langage naturel.

*   **US 1.1 - Recherche en Langage Naturel**
    *   *En tant que* utilisateur, je veux décrire mon client idéal (ICP) en une phrase (ex: "Startups fintech à Londres qui recrutent").
    *   *Afin de* lancer une recherche sans configurer de filtres complexes.
    *   *Tech :* Dust + Exa.ai (Natural language search).

*   **US 1.2 - Filtrage par Similarité**
    *   *En tant que* utilisateur, je veux fournir une URL d'une entreprise que j'aime déjà.
    *   *Afin de* trouver des "lookalikes" (entreprises similaires).
    *   *Tech :* Exa.ai `findSimilar`.

## Epic 2 : Deep Enrichment (La "Qualification")
**Objectif :** Vérifier et enrichir les leads en visitant leurs sites web.

*   **US 2.1 - Vérification du Site Web**
    *   *En tant que* système, je veux visiter le site web de chaque lead détecté.
    *   *Afin de* vérifier que le site est actif et correspond bien au secteur.
    *   *Tech :* Lightpanda (Headless browser).

*   **US 2.2 - Extraction de Contacts & Stack**
    *   *En tant que* utilisateur, je veux extraire les emails publics ou les technologies utilisées (ex: Stripe, Hubspot) sur le site.
    *   *Afin de* prioriser mes prospects.
    *   *Tech :* Lightpanda + Regex/LLM Extraction.

## Epic 3 : Interface Agentique (Le "Contrôle")
**Objectif :** Interagir avec l'outil via une interface chat simple.

*   **US 3.1 - Chat Interface**
    *   *En tant que* utilisateur, je veux discuter avec l'agent LeadSwap pour affiner ma recherche.
    *   *Afin de* itérer rapidement ("Non, vise plutôt des entreprises de +50 employés").
    *   *Tech :* Dust Assistant.

*   **US 3.2 - Affichage des Résultats**
    *   *En tant que* utilisateur, je veux voir une liste structurée (Tableau) des leads trouvés avec un score de pertinence.
    *   *Afin de* valider la sélection.

## Epic 4 : Export & Action (La "Livraison")
**Objectif :** Récupérer les données pour la prospection.

*   **US 4.1 - Export CSV/JSON**
    *   *En tant que* utilisateur, je veux télécharger ma liste de leads qualifiés.
    *   *Afin de* les importer dans mon CRM ou outil de cold outreach.

*   **US 4.2 - "Swap" Logic (MVP)**
    *   *En tant que* utilisateur, je veux marquer les leads que je refuse pour que l'IA apprenne (Feedback loop).
    *   *Afin de* améliorer les prochaines recherches.
