# retoast
stateless react toaster made easy.

# installation
```
npm i retoast
```
or
```
yarn add retoast
```

## import to your project
```js
import retoast from 'retoast'
```

### import the css
```js
import 'retoast/dist/css/main.css'
```

# **_Props_**

**key** (_optional_): **_any_**
_{it makes the toaster controllable}_

**body** (_required_): **_string | reactnode_**
_{the body of the toaster}_

**className** (_optional_): **_string_**
_{you can add class for to toaster}_

**classEnter** (_optional_): **_string_**
_{you can customize your own class animation enter}_

**classExit** (_optional_): **_string_**
_{you can customize your own class animation exit}_

**variant** (_optional_): **_'primary' | 'success' | 'danger' | 'warning' | 'info'_**
_{the variant of the toaster}_

**placement** (_optional_): **_'top' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'_**
_{the position of the toaster}_

**duration** (_optional_): **_number_**
_{the duration that stay the toaster when put **0** the toaster will stay forever}_

**delay** (_optional_): **_number_**
_{the duration/timing of the animation}_

**dismissible** (_optional_): **_boolean_**
_{when true it will show a close button}_


**onMount** (_optional_): **_function_**
_{to determine if the toaster is mounted}_

**onUnmount** (_optional_): **_function_**
_{to determine if the toaster is unmounted}_

**onDismissed** (_optional_): **_function_**
_{to determine if the toaster is close by clicking dismissed button}_
# _**Usage**_

```js
retoast({
    body: 'show me toast'
})
```

# _**TIP**_

The unmounting time is 600 milliseconds so if you are about to customize closing animation it must be within that time range to show the whole animation
