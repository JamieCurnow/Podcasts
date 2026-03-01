export default defineAppConfig({
  ui: {
    notification: {
      background: 'bg-neutral-100 dark:bg-neutral-800',
      description: 'text-white font-semibold'
    },
    notifications: {
      // Show toasts at the top right of the screen
      position: 'bottom-20 top-[unset]'
    },
    button: {
      variant: {
        ghost: 'hover:bg-transparent dark:hover:bg-transparent'
      },
      color: {
        custom: {
          subtle: '...'
        }
      }
    },
    input: {
      placeholder: 'font-light placeholder-neutral-800 dark:placeholder-neutral-400',
      rounded: 'rounded-lg',
      padding: {
        md: 'px-4 py-3'
      },
      leading: {
        padding: {
          md: 'ps-14'
        }
      },
      size: {
        md: 'text-lg'
      },
      gap: {
        md: 'gap-4'
      },
      icon: {
        size: {
          md: 'size-6'
        },
        leading: {
          padding: {
            md: 'px-6'
          }
        }
      },
      color: {
        white: {
          outline:
            'shadow-none bg-transparent dark:bg-transparent text-neutral-900 dark:text-neutral-300 ring-1 ring-inset ring-neutral-300 dark:ring-neutral-500 focus:ring-none'
        }
      },
      variant: {
        outline: 'shadow-none bg-transparent'
      },
      default: {
        size: 'md',
        color: 'white',
        loadingIcon: 'i-mdi-loading'
      }
    },
    range: {
      thumb: {
        background:
          '[&::-webkit-slider-thumb]:bg-current [&::-webkit-slider-thumb]:dark:bg-current [&::-moz-range-thumb]:bg-current'
      }
    },
    dropdown: {
      background: 'bg-neutral-100 dark:bg-neutral-800',
      ring: 'ring-2 ring-neutral-200 dark:ring-neutral-900',
      rounded: 'rounded-md',
      item: {
        size: 'text-md font-light',
        icon: {
          base: 'flex-shrink-0 size-6'
        }
      }
    },
    slideover: {
      background: 'bg-neutral-100 dark:bg-neutral-800'
    },
    primary: 'stone',
    gray: 'cool',
    neutral: 'neutral',
    stone: 'stone'
  }
})
