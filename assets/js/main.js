(() => {
    "use strict";

    const defaults = {
        style: "solid",
        thickness: 2,
        width: 100,
        spacing: 32,
        color: "#e88768",
    };

    const state = { ...defaults };

    const elements = {
        divider: document.querySelector("#live-divider"),
        thickness: document.querySelector("#line-thickness"),
        thicknessValue: document.querySelector("#thickness-value"),
        width: document.querySelector("#line-width"),
        widthValue: document.querySelector("#width-value"),
        spacing: document.querySelector("#line-spacing"),
        spacingValue: document.querySelector("#spacing-value"),
        styleButtons: [...document.querySelectorAll("[data-style]")],
        colorButtons: [...document.querySelectorAll("[data-color]")],
        generatedCss: document.querySelector("#generated-css"),
        copyButton: document.querySelector("#copy-code"),
        copyStatus: document.querySelector("#copy-status"),
        resetButton: document.querySelector("#reset-controls"),
    };

    function getCss() {
        const borderWidth =
            state.style === "double"
                ? Math.max(3, state.thickness * 2)
                : state.thickness;

        return [
            ".divider {",
            "  border: 0;",
            `  border-top: ${borderWidth}px ${state.style} ${state.color};`,
            `  width: ${state.width}%;`,
            `  margin-block: ${state.spacing}px;`,
            "}",
        ].join("\n");
    }

    function render() {
        elements.divider.style.border = "0";
        elements.divider.style.borderTop = `${state.style === "double" ? Math.max(3, state.thickness * 2) : state.thickness}px ${state.style} ${state.color}`;
        elements.divider.style.width = `${state.width}%`;
        elements.divider.style.marginBlock = `${state.spacing}px`;

        elements.thickness.value = String(state.thickness);
        elements.thicknessValue.value = `${state.thickness}px`;
        elements.thicknessValue.textContent = `${state.thickness}px`;

        elements.width.value = String(state.width);
        elements.widthValue.value = `${state.width}%`;
        elements.widthValue.textContent = `${state.width}%`;

        elements.spacing.value = String(state.spacing);
        elements.spacingValue.value = `${state.spacing}px`;
        elements.spacingValue.textContent = `${state.spacing}px`;

        elements.styleButtons.forEach((button) => {
            const active = button.dataset.style === state.style;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });

        elements.colorButtons.forEach((button) => {
            const active = button.dataset.color === state.color;
            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });

        elements.generatedCss.textContent = getCss();
        elements.copyStatus.textContent = "";
    }

    function selectStyle(style) {
        if (!["solid", "dashed", "dotted", "double"].includes(style)) {
            return;
        }

        state.style = style;
        render();
    }

    function selectColor(color) {
        const isValidColor = elements.colorButtons.some(
            (button) => button.dataset.color === color,
        );

        if (!isValidColor) return;

        state.color = color;
        render();
    }

    async function copyCode() {
        const css = getCss();

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(css);
            } else {
                const textarea = document.createElement("textarea");
                textarea.value = css;
                textarea.setAttribute("readonly", "");
                textarea.style.position = "fixed";
                textarea.style.opacity = "0";
                document.body.appendChild(textarea);
                textarea.select();

                const copied = document.execCommand("copy");
                textarea.remove();

                if (!copied) {
                    throw new Error("Copy command failed");
                }
            }

            elements.copyStatus.textContent = "CSS COPIED TO CLIPBOARD.";
        } catch {
            elements.copyStatus.textContent =
                "COPY UNAVAILABLE — SELECT AND COPY THE CSS ABOVE.";
        }
    }

    function reset() {
        Object.assign(state, defaults);
        render();
    }

    elements.styleButtons.forEach((button) => {
        button.addEventListener("click", () => {
            selectStyle(button.dataset.style);
        });
    });

    elements.colorButtons.forEach((button) => {
        button.addEventListener("click", () => {
            selectColor(button.dataset.color);
        });
    });

    elements.thickness.addEventListener("input", (event) => {
        state.thickness = Number(event.target.value);
        render();
    });

    elements.width.addEventListener("input", (event) => {
        state.width = Number(event.target.value);
        render();
    });

    elements.spacing.addEventListener("input", (event) => {
        state.spacing = Number(event.target.value);
        render();
    });

    elements.copyButton.addEventListener("click", copyCode);
    elements.resetButton.addEventListener("click", reset);

    render();
})();
