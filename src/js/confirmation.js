import {Popover} from 'bootstrap'

export default class Confirmation {
    constructor() {
        // super(element, config)
        const elements = Array.from(document.querySelectorAll('[data-bs-toggle="confirmation"]'))

        Array.from(elements).forEach(el => {
            this.init(el)
        })
    }

    init(el) {
        const options = {
            html: true
        }

        if (el.dataset.singleton && ['true', 'always'].includes(el.dataset.singleton)) {
            // el should be an "a" element tabindex defined
            // this check this is true or not
            if (null !== el.getAttribute('tabindex')) {
                if (el.dataset.singleton === 'always' || el.tagName === 'A') {
                    options.trigger = 'focus'
                } else {
                    console.error('For proper cross-browser and cross-platform behaviour, this element should be a link and have tabindex defined.', "\r\n\r\nMore: https://getbootstrap.com/docs/5.3/components/popovers/#dismiss-on-next-click")
                }
            } else {
                console.error('Please provide a tabindex attribute on element', el)
            }
        }

        const po = new Popover(el, options)
        const contentElements = this.createContent(el.dataset?.bsContent)
        po.setContent({
            '.popover-header': el.dataset?.bsTitle,
            '.popover-body': contentElements.content
        })

        // keep bounded function reference
        const cancel = this.onCancel.bind(null, po)
        const ok = this.onOk.bind(null, el)

        // Events
        el.addEventListener('click', e => {
            e.preventDefault()
        })

        el.addEventListener('hide.bs.popover', () => {
            contentElements.buttons.cancel.removeEventListener('click', cancel, true)
            contentElements.buttons.ok.removeEventListener('click', ok, true)
        })

        el.addEventListener('show.bs.popover', () => {
            contentElements.buttons.cancel.addEventListener('click', cancel, true)
            contentElements.buttons.ok.addEventListener('click', ok, true)
        })
    }

    createContent(content) {
        const wrapper = document.createElement('div')

        const textWrapper = document.createElement('div')
        textWrapper.innerText = content

        const buttonWrapper = document.createElement('div')

        const okButton = document.createElement('a')
        const cancelButton = document.createElement('a')
        okButton.classList.add(...['btn', 'btn-sm', 'btn-success'])
        cancelButton.classList.add(...['btn', 'btn-sm', 'btn-danger'])
        okButton.innerText = 'Ok'
        cancelButton.innerText = 'Cancel'

        // insert button inside the wrapper
        buttonWrapper.insertAdjacentElement('afterbegin', cancelButton)
        buttonWrapper.insertAdjacentElement('afterbegin', okButton)


        wrapper.insertAdjacentElement('afterbegin', buttonWrapper)
        wrapper.insertAdjacentElement('afterbegin', textWrapper)

        return {
            content: wrapper,
            buttons: {
                'ok': okButton,
                'cancel': cancelButton
            }
        }
    }

    onCancel(po, e) {
        e.preventDefault()
        po.hide()
    }

    onOk(el, e) {
        const href = el.href || el.dataset.href || null

        if (href) {
            window.location.href = href
        } else {
            console.info('No href target found')
        }
    }
}