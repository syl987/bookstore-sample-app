# TODO List

## Features

- [ ] prevent scrolling of the google-books dialog search query
- [ ] add "load more" button to google-books search results
- [ ] user-books as module and lazy load all components together
- [ ] add terms-of-use page
- [ ] add contact page
- [ ] remove work-in-progress info
- [ ] on buy: navigate to user books => create a success dialog
- [ ] volume / offer detail: add support for 404
- [ ] user-book edit / detail: add support for 404
- [ ] resolve navigation between book and volume or display offer list
- [ ] improve user-book edit
  - [ ] navigate to user books after an action
  - [ ] delete book (if not sold)
- [ ] add github icon link
- [x] table actions sticky right
- [ ] display search string besides clear search button
- [ ] create inline mat-button link
- [ ] add routing to user-books sub pages (draft, published, sold, bought)

## Bugs

- [ ] change detection not fired after photo upload
- [ ] title-bar incorrect heading on navigation error

## Styling

- [ ] add icons to all non-header buttons
- [ ] check button colors, close cancel buttons all neutral color
- [ ] fix tech-stack icons rounded borders

## Technical

- [ ] consider hosting tech-stack logos internally
- [ ] adjust eslint rules
- [ ] place method signal values at the top
- [ ] separate css/scss in angular.json per plugin or merge back together
  - [x] material
  - [ ] cdk (if needed)
  - [x] tailwindcss
  - [x] flagpack
  - [ ] rename styles.scss as custom.scss
- [ ] component init actions via resolvers + check execution conditions
- [ ] try replace any final observables and code subscriptions with signals
  - [ ] check for any mergeable streams using computed
- [ ] use functional guards / resolvers / effects
- [ ] resolve deprecations
- [ ] create functions for each pipe + avoid injecting pipes
- [ ] research and apply any ngrx syntax updates
  - [ ] functions
  - [ ] map creators
  - [ ] property selectors
- [ ] split user-books code as feature with lazy loading and providers
- [ ] split volumes code as feature with lazy loading and providers
- [ ] replace generated translations keys with custom strings
- [ ] resolve sass deprecations
- [ ] replace sass imports
- [ ] check file delete feature works properly

## Maintenance

- [ ] resolve any todo comments in code
- [ ] resolve any commented code

### Miscellaneous

- [ ] add loading appearance to volume card
- [ ] keep same page after login
- [ ] guard and keep same page or redirect after logout
- [ ] improve image upload
  - [ ] kick readonly format
  - [ ] add placeholder image
  - [ ] display progress spinner
- [ ] add store logic for firebase data streams
