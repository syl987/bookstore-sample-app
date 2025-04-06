# TODO List

## Features

- [ ] add terms-of-use page
- [ ] add data-policy page
- [ ] update welcome-page wordings
  - [ ] eslint 9 + text
  - [ ] sass text
- [ ] remove any work-in-progress info
- [ ] on buy: navigate to user books => create a success dialog
- [ ] volume / offer detail: add support for 404
- [ ] user-book edit / detail: add support for 404
- [ ] resolve navigation between book and volume or display offer list
- [ ] improve user-book edit
  - [ ] upload button spinner
  - [ ] navigate to user books after an action
  - [ ] delete book (if not sold)
  - [ ] check file delete feature works properly
- [ ] add github link?
- [ ] allow book deletion if published + delete the volume if not related to any books

## Maintainance Tasks

- [ ] resolve any todo comments in code
- [ ] resolve any commented code

## Technical Improvements

- [ ] adjust eslint rules
- [ ] use signals api for everything - kick any unnecessary decorators
- [ ] component init actions via resolvers + check execution conditions
- [ ] try replace any final observables and code subscriptions with signals
  - [ ] check for any mergeable streams using computed
- [ ] use functional guards / resolvers / effects
- [x] use inject statements instead of constructors
- [ ] welcome-page content as array data (keep translatable)
- [ ] update to material 3 with light theme + use more colors + adjust welcome page
- [ ] add dark theme with material 3
- [x] replace bootstrap with tailwindcss v4 + adjust welcome page
- [ ] setup stylelint
- [ ] resolve deprecations
- [ ] create functions for each pipe + avoid injecting pipes
- [ ] research and apply any ngrx syntax updates
  - [ ] functions
  - [ ] map creators
  - [ ] property selectors
- [x] rename variables to match their type, i.g. destroyRef, changeDetectorRef
- [ ] split user-books code as feature with lazy loading and providers
- [ ] split volumes code as feature with lazy loading and providers
- [ ] replace generated translations keys with custom strings
- [ ] resolve sass deprecations
- [ ] replace sass imports

### Low Priority

- [ ] add loading appearance to volume card
- [ ] keep same page after login
- [ ] guard and keep same page or redirect after logout
- [ ] improve image upload
  - [ ] kick readonly format
  - [ ] add placeholder image
  - [ ] display progress spinner
- [ ] add store logic for firebase data streams

## Bug Issues

- [ ] change detection not fired after photo upload
- [ ] gap helper conflicts with negative link margin in the title-bar
