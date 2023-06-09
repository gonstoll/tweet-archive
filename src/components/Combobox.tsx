'use client'

import * as Ariakit from '@ariakit/react'
import * as React from 'react'

export interface ComboboxProps
  extends Omit<React.ComponentPropsWithoutRef<'input'>, 'onChange'> {
  label?: string
  defaultValue?: string
  value?: string
  onChange?: (value: string) => void
  values?: Array<string>
  onValuesChange?: (values: Array<string>) => void
}

export const Combobox = React.forwardRef<HTMLInputElement, ComboboxProps>(
  function Combobox(props, ref) {
    const {
      label,
      defaultValue,
      value,
      onChange,
      values,
      onValuesChange,
      children,
      ...comboboxProps
    } = props

    const combobox = Ariakit.useComboboxStore({
      defaultValue,
      value,
      setValue: onChange,
      resetValueOnHide: true,
    })

    const select = Ariakit.useSelectStore({
      combobox,
      value: values,
      setValue: onValuesChange,
    })

    const selectValue = select.useState('value')

    // Reset the combobox value whenever an item is checked or unchecked.
    React.useEffect(() => combobox.setValue(''), [selectValue, combobox])

    const defaultInputId = React.useId()
    const inputId = comboboxProps.id || defaultInputId

    return (
      <div>
        {label ? <label htmlFor={inputId}>{label}</label> : null}
        <Ariakit.Combobox
          ref={ref}
          id={inputId}
          store={combobox}
          className="mb-4 w-full rounded-md border-1 border-slate-200 p-2"
          {...comboboxProps}
        >
          Hola!
        </Ariakit.Combobox>
        <Ariakit.ComboboxPopover
          store={combobox}
          sameWidth
          gutter={8}
          className="z-50 flex flex-col rounded-md border-1 border-slate-300 bg-white"
          render={props => <Ariakit.SelectList store={select} {...props} />}
        >
          {children}
        </Ariakit.ComboboxPopover>
      </div>
    )
  }
)

export interface ComboboxItemProps
  extends React.ComponentPropsWithoutRef<'div'> {
  value?: string
}

export const ComboboxItem = React.forwardRef<HTMLDivElement, ComboboxItemProps>(
  function ComboboxItem(props, ref) {
    return (
      // Here we're combining both SelectItem and ComboboxItem into the same
      // element. SelectItem adds the multi-selectable attributes to the element
      // (for example, aria-selected).
      <Ariakit.SelectItem
        ref={ref}
        className="flex cursor-pointer items-center gap-2 p-2"
        render={props => <Ariakit.ComboboxItem {...props} />}
        {...props}
      >
        <Ariakit.SelectItemCheck />
        {props.children || props.value}
      </Ariakit.SelectItem>
    )
  }
)
