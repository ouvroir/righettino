/// <reference types="vite/client" />

declare var ITEMS: { [filename: string]: SVGPathElement }

declare var SECTIONS: {
    [sectionId: string]: {
        files: string[] | undefined,
        zoom: int[] | undefined
    }
}

declare var viewer: OpenSeadragon.Viewer
declare var viewport: OpenSeadragon.Viewer.viewport
declare var imagingHelper: imagingHelper