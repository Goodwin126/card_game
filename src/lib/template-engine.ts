export type TemplateBlock =
    | string
    | number
    | boolean
    | TemplateNode
    | TemplateNode[];

export interface TemplateNode {
    tag: string;
    cls?: string | string[];
    attrs?: Record<string, string | boolean>;
    content?: TemplateBlock;
}

export function templateEngine(block: TemplateBlock) {
    if (block === undefined || block === null || block === false) {
        return document.createTextNode("");
    }
    if (
        typeof block === "string" ||
        typeof block === "number" ||
        block === true
    ) {
        return document.createTextNode(String(block));
    }
    if (Array.isArray(block)) {
        const fragment = document.createDocumentFragment();

        block.forEach((element) => {
            fragment.appendChild(templateEngine(element));
        });

        return fragment;
    }

    const result = document.createElement(block.tag);

    if (block.cls) {
        // Преобразуем cls в массив, если это не массив
        const classes = typeof block.cls === "string" ? [block.cls] : block.cls;

        classes.forEach((cls: string) => {
            result.classList.add(cls);
        });
    }

    function hasAttrs(
        block: TemplateNode
    ): block is TemplateNode & { attrs: Record<string, string | boolean> } {
        return block.attrs !== undefined;
    }

    if (hasAttrs(block)) {
        const keys = Object.keys(block.attrs);
        keys.forEach((key: string) => {
            const value = block.attrs[key];
            if (typeof value === "string") {
                result.setAttribute(key, value);
            } else if (value === true) {
                result.setAttribute(key, "");
            }
        });
    }

    if (block.content !== undefined) {
        result.appendChild(templateEngine(block.content));
    }

    return result;
}
