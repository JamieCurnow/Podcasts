export default defineAppConfig({
  ui: {
    colors: {
      primary: 'stone',
      neutral: 'neutral'
    },
    button: {
      slots: {
        base: 'cursor-pointer'
      },
      variants: {
        variant: {
          ghost: 'hover:bg-transparent dark:hover:bg-transparent'
        }
      }
    },
    input: {
      slots: {
        root: 'rounded-lg'
      },
      defaultVariants: {
        size: 'xl'
      }
    },
    slideover: {
      slots: {
        content: 'bg-neutral-100 dark:bg-neutral-800'
      }
    },
    dropdownMenu: {
      slots: {
        content:
          'bg-neutral-100 dark:bg-neutral-800 ring-2 ring-neutral-200 dark:ring-neutral-900 rounded-md',
        item: 'text-md font-light',
        itemLeadingIcon: 'size-6'
      }
    },
    modal: {
      slots: {
        content: 'bg-neutral-100 dark:bg-neutral-800'
      }
    },
    toast: {
      slots: {
        root: 'bg-neutral-100 dark:bg-neutral-800'
      }
    },
    slider: {
      slots: {
        thumb: 'ring-0 bg-neutral-500 dark:bg-neutral-400',
        track: 'bg-neutral-200 dark:bg-neutral-700',
        range: 'bg-neutral-500! dark:bg-neutral-400!'
      },
      variants: {
        size: {
          xs: {
            track: 'h-1!'
          }
        }
      }
    }
  }
})
