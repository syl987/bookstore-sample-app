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
- [ ] display search string besides clear search button
- [ ] add routing to user-books sub pages (draft, published, sold, bought)
  - [ ] create grid component for tab panel
  - [ ] with tab panel slide animations
- [ ] add loading appearance to volume card
- [ ] keep same page after login
- [ ] guard and keep same page or redirect after logout
- [ ] improve image upload
  - [ ] add placeholder image
  - [ ] add progress percentage
  - [ ] allow deleting a single image
- [ ] shorten the header search field
- [x] add welcome-page material theming feature item
- [x] add welcome-page accessibility feature item
- [ ] add stylelint to tech-stack, potentially kick github

## Bugs

- [ ] change detection not fired after photo upload
- [ ] title-bar incorrect heading on navigation error

## Styling

- [x] add active tab surface-container background
- [x] fix missing snack-bar border

## Technical

- [ ] rename offer list component from list to table
- [ ] create inline mat-button link
- [ ] consider hosting tech-stack logos internally
- [ ] extract signal values as const at the top of a code block
- [ ] execute component on-init actions via resolvers + check execution conditions
- [ ] use functional guards / resolvers / effects
- [ ] create functions for each pipe + avoid injecting pipes into code
- [ ] research and apply any ngrx syntax updates
  - [ ] functions
  - [ ] map creators
  - [ ] property selectors
- [ ] split user-books code as feature with lazy loading and providers
- [ ] split volumes code as feature with lazy loading and providers
- [ ] replace generated translations keys with custom strings
- [ ] check if file delete feature works properly, deleting file and all data
- [ ] check material components docs for any missing accessibility

## Maintenance

- [ ] resolve any todo comments in code
- [ ] resolve any commented code

### Miscellaneous

- [ ] support progress spinners for backend tasks
- [ ] add store logic for firebase data streams
- [ ] add e2e testing to avoid unintended breaking changes
