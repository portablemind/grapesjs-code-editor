const swv = 'sw-visibility'
const osm = 'open-sm'
const otm = 'open-tm'
const ola = 'open-layers'
const obl = 'open-blocks'
const ful = 'fullscreen'
const prv = 'preview'

const panels = {
  defaults: [
    {
      id: 'options',
      buttons: [
        {
          active: true,
          id: swv,
          className: 'fa fa-square-o',
          command: swv,
          context: swv,
          attributes: { title: 'View components' }
        },
        {
          id: prv,
          className: 'fa fa-eye',
          command: prv,
          context: prv,
          attributes: { title: 'Preview' }
        },
        {
          id: ful,
          className: 'fa fa-arrows-alt',
          command: ful,
          context: ful,
          attributes: { title: 'Fullscreen' }
        }
      ]
    },
    {
      id: 'views',
      buttons: [
        {
          id: osm,
          className: 'fa fa-paint-brush',
          command: osm,
          active: true,
          attributes: { title: 'Open Style Manager' }
        },
        {
          id: otm,
          className: 'fa fa-cog',
          command: otm,
          attributes: { title: 'Settings' }
        },
        {
          id: ola,
          className: 'fa fa-bars',
          command: ola,
          attributes: { title: 'Open Layer Manager' }
        },
        {
          id: obl,
          className: 'fa fa-th-large',
          command: obl,
          attributes: { title: 'Open Blocks' }
        },
        {
          id: 'open-code',
          className: 'fa fa-code',
          command: 'open-code',
          attributes: { title: 'Open Code' }
        }
      ]
    }
  ]
}

export default panels
