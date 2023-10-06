import {Popover} from 'bootstrap'
import '../scss/popover.scss'

const DEFAULT_BUTTONS = {
    'yes': {
        'event': 'click',
        'class': ['btn', 'btn-sm', 'btn-success'],
        'action': 'onOk'
    },
    'no': {
        'event': 'click',
        'class': ['btn', 'btn-sm', 'btn-danger'],
        'action': 'onCancel'
    }
}

export default class Confirmation {
    constructor(options = {}) {
        // super(element, config)
        const elements = Array.from(document.querySelectorAll('[data-bs-toggle="confirmation"]'))

        this.options = {
            html: true,
            forceOpen: false,
            ...options,
            // template option could overwrite the purposed one, force to this
            ...{template: this._template()}
        }

        Array.from(elements).forEach(el => {
            this.init(el, this.options)
        })
    }

    _template() {
        return `<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div><div class="popover-buttons"></div></div>`
    }

    createButtons(el, po, buttons = DEFAULT_BUTTONS) {
        const container = document.createElement('div')

        for (let [key, entry] of Object.entries(DEFAULT_BUTTONS).reverse()) {
            const button = document.createElement('button')
            button.classList.add(...entry.class)
            button.innerText = key

            // keep bounded function reference
            const button_event = this[entry.action].bind(null, el, po)

            el.addEventListener('show.bs.popover', () => {
                button.addEventListener(entry.event, button_event, true)
            })

            el.removeEventListener('show.bs.hide', () => {
                button.addEventListener(entry.event, button_event, true)
            })

            container.insertAdjacentElement('afterbegin', button)
        }

        return container
    }

    init(el, options) {
        if (el.dataset.singleton && ['true', 'always'].includes(el.dataset.singleton)) {
            // el should be an "a" element tabindex defined
            // this check this is true or not
            if (null !== el.getAttribute('tabindex')) {
                if (el.dataset.singleton === 'always'/* || el.tagName === 'A'*/) {
                    options.trigger = 'focus'
                } else {
                    console.error('For proper cross-browser and cross-platform behaviour, this element should be a link and have tabindex defined.', "\r\n\r\nMore: https://getbootstrap.com/docs/5.3/components/popovers/#dismiss-on-next-click")
                }
            } else {
                console.error('Please provide a tabindex attribute on element', el)
            }
        }

        const po = new Popover(el, options)

        // @todo: prevent show on context menu
        // el.addEventListener('contextmenu', e => {
            // e.preventDefault()
            // console.log(e)
        // })

        const buttons = this.createButtons(el, po)
        po.setContent({
            '.popover-header': el.dataset?.bsTitle,
            '.popover-body': el.dataset?.bsContent,
            '.popover-buttons': buttons
        })

        if (this.options.forceOpen) {
            po.show()
        }

        // Events
        el.addEventListener('click', e => {
            e.preventDefault()
        })
    }

    onCancel(el, po, e) {
        e.preventDefault()
        po.hide()
    }

    onOk(el, po, e) {
        const href = el.href || el.dataset.href || null

        if (href) {
            window.location.href = href
        } else {
            if (el.type === 'submit') {
                el.closest('form')?.dispatchEvent(new Event('submit'))
            } else {
                console.info('No href target found')
            }
        }
    }
}