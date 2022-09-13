/// <reference types="vite/client" />

declare module '@openseadragon-imaging/openseadragon-viewerinputhook'
declare module '@openseadragon-imaging/openseadragon-imaginghelper'


declare var ITEMS: { [filename: string]: SVGPathElement }

declare var SECTIONS: {
    [sectionId: string]: {
        files: string[] | undefined,
        zoom: number[] | undefined
    }
}

declare var keepHighlight: boolean

declare var viewer: OpenSeadragon.Viewer
declare var viewport: OpenSeadragon.Viewer.viewport
declare var imagingHelper: imagingHelper

