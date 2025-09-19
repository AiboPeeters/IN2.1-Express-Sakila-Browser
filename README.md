# Beunotheek - Een Sakila Browser met Express

Welkom bij de Beunotheek!  
Deze Node.js/Express-applicatie is ontwikkeld voor het beheren en bekijken van films, uit de sakila oefendatabase van mySQL.

De webapp is online te bezoeken via [https://beunotheek.aptrs.nl](https://beunotheek.aptrs.nl/).

## Functionaliteit

- **Films zoeken, toevoegen, bewerken en verwijderen**
- **Authenticatie:** Ingelogde admins kunnen films bekijken/toevoegen/bewerken/verwijderen, zonder in te loggen kan je alleen het aanbod van films bekijken.

## Installatie

1. **Clone de repository**
2. **Installeer dependencies**
   ```
   npm install
   ```
3. **Vul `.env` aan met jouw databasegegevens**
   ```
   DB_HOST=...
   DB_PORT=...
   DB_USER=...
   DB_DATABASE=...
   DB_PASSWORD=...
   ```

4. **Start de server**
   ```
   npm run start
   ```
   Voor development (met debug logging):
   ```
   npm run start_dev
   ```

## Gebruik

- Ga naar [http://localhost:3000](http://localhost:3000) voor de webinterface.
- Log in als admin om films toe te voegen, te bewerken of te verwijderen.

## Testen

- Cypress tests staan lokaal in `/cypress/e2e` en zijn **niet opgenomen in de GitHub repository**.
- Test uitvoeren:
  ```
  npm run cy:run
  ```

## Docker

Je kunt de webapp ook starten via Docker Compose. Zie `compose.yaml`.

## Technologieën

- Node.js
- Express.js
- Pug template engine
- Bootstrap
- MySQL (extern)
- Winston (logging)
- Cypress (testen)

## Auteur

Aibo Peeters  
Student Informatica, Avans Hogeschool
