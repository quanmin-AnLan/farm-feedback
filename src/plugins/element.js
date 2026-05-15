import Vue from 'vue'
import Alert from 'element-ui/lib/alert'
import Button from 'element-ui/lib/button'
import Checkbox from 'element-ui/lib/checkbox'
import CheckboxGroup from 'element-ui/lib/checkbox-group'
import Dialog from 'element-ui/lib/dialog'
import Form from 'element-ui/lib/form'
import FormItem from 'element-ui/lib/form-item'
import Input from 'element-ui/lib/input'
import Option from 'element-ui/lib/option'
import Radio from 'element-ui/lib/radio'
import RadioGroup from 'element-ui/lib/radio-group'
import Select from 'element-ui/lib/select'
import Upload from 'element-ui/lib/upload'

import 'element-ui/lib/theme-chalk/base.css'
import 'element-ui/lib/theme-chalk/alert.css'
import 'element-ui/lib/theme-chalk/button.css'
import 'element-ui/lib/theme-chalk/checkbox.css'
import 'element-ui/lib/theme-chalk/checkbox-group.css'
import 'element-ui/lib/theme-chalk/dialog.css'
import 'element-ui/lib/theme-chalk/form.css'
import 'element-ui/lib/theme-chalk/form-item.css'
import 'element-ui/lib/theme-chalk/input.css'
import 'element-ui/lib/theme-chalk/option.css'
import 'element-ui/lib/theme-chalk/popper.css'
import 'element-ui/lib/theme-chalk/radio.css'
import 'element-ui/lib/theme-chalk/radio-group.css'
import 'element-ui/lib/theme-chalk/scrollbar.css'
import 'element-ui/lib/theme-chalk/select.css'
import 'element-ui/lib/theme-chalk/select-dropdown.css'
import 'element-ui/lib/theme-chalk/upload.css'

;[
  Alert,
  Button,
  Checkbox,
  CheckboxGroup,
  Dialog,
  Form,
  FormItem,
  Input,
  Option,
  Radio,
  RadioGroup,
  Select,
  Upload,
].forEach((c) => Vue.use(c))
