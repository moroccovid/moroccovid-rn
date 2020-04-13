## MorocCovid

### Structure:

The app file structure is as follows:

#### Components:

A folder where we'll put all of our components in a tree structure, for example, if we have a screen with children, it'd be like this:

- Root
  - Child 1
  - Child 2
    - Inner child 1
    - Inner child 2
  - Child 3

#### Navigation:

Everything that has to do with navigation, for the moment we have to navigations:

- A root stack navigation with two components:
  - Login/Signup (where we'll ask for the number)
  - Drawer (the second navigation which will have all of our components):
    - Welcome
    - Tracking
    - History (Trajets)
    - Survey
    - Settings
    - Terms
    - About us

#### Assets:

Our assets, anything from images to fonts, etc...

#### android/ios:

Specific files for each native platform.

#### Theme

We'll have our colors and such in there.
