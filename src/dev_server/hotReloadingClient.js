export default (__SNEL__HOST__) => {
  const __SNEL__HOT__PORT__ = Number(window.location.port) + 1;

  if ("WebSocket" in window) {
    const socket = new WebSocket(
      `ws://${__SNEL__HOST__}:${__SNEL__HOT__PORT__}`
    );

    const css = `p code{border-radius:2px;background-color:#eee;color:#111}#editing,#highlighting{margin:10px;padding:10px;border:0;width:calc(100% - 32px);height:150px}#editing,#highlighting,#highlighting *{font-size:15pt;font-family:monospace;line-height:20pt}#editing,#highlighting{position:absolute;top:0;left:0}#editing{z-index:1}#highlighting{z-index:0}#editing{color:transparent;background:transparent;caret-color:white}#editing,#highlighting{overflow:auto}#editing{resize:none}code[class*="language-"],pre[class*="language-"]{font-family:Consolas,Monaco,"Andale Mono","Ubuntu Mono",monospace;font-size:1em;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;word-wrap:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none}pre[class*="language-"]{padding:.4em .8em;margin:.5em 0;overflow:auto;background:#242829;border-radius:5px}code[class*="language-"]{background:#242829;color:white}:not(pre)>code[class*="language-"]{padding:.2em;border-radius:.3em;box-shadow:none;white-space:normal}.token.comment,.token.prolog,.token.doctype,.token.cdata{color:#aaa}.token.punctuation{color:#999}.token.namespace{opacity:.7}.token.property,.token.tag,.token.boolean,.token.number,.token.constant,.token.symbol{color:#0cf}.token.selector,.token.attr-name,.token.string,.token.char,.token.builtin{color:yellow}.token.operator,.token.entity,.token.url,.language-css .token.string,.token.variable,.token.inserted{color:yellowgreen}.token.atrule,.token.attr-value,.token.keyword{color:deeppink}.token.regex,.token.important{color:orange}.token.important,.token.bold{font-weight:bold}.token.italic{font-style:italic}.token.entity{cursor:help}.token.deleted{color:red}pre.diff-highlight.diff-highlight>code .token.deleted:not(.prefix),pre>code.diff-highlight.diff-highlight .token.deleted:not(.prefix){background-color:rgba(255,0,0,0.3);display:inline}pre.diff-highlight.diff-highlight>code .token.inserted:not(.prefix),pre>code.diff-highlight.diff-highlight .token.inserted:not(.prefix){background-color:rgba(0,255,128,0.3);display:inline}`;

    socket.addEventListener("open", () => {
      console.log(
        "%c Snel %c Hot Reloading %c",
        "background:#35495e; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff",
        "background:#ff3e00; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff",
        "background:transparent"
      );

      socket.send(
        JSON.stringify({
          connect_to: ["Reload"],
        })
      );
    });

    socket.addEventListener("close", () => {
      console.log(
        "%c Hot Reloading %c connection cut off 🔌 %c",
        "background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff",
        "background:#ff3e00 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff",
        "background:transparent"
      );
      alert("Hot Reloading connection cut off 🔌");
    });

    socket.addEventListener("error", () => {
      console.log(
        "%c Hot Reloading %c connection error %c",
        "background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff",
        "background:#ff3e00 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff",
        "background:transparent"
      );
      alert("Hot Reloading connection error");
    });

    const Reload = () => {
      const badge = document.querySelector("#msg");
      if (badge) badge.setAttribute("style", "margin-top: 30px;");
      window.location.reload();
    };

    socket.addEventListener("message", (event) => {
      try {
        const { message } = JSON.parse(event.data);

        if (message === "reload") {
          console.log(
            "%c 🔥 %c Reloading... %c",
            "background:#35495e; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff;",
            "background:#ff3e00; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff;",
            "background:transparent"
          );
          Reload();
        }

        if (message === "compiling") {
          console.log(
            "%c 🔥 %c Recompiling... %c",
            "background:#35495e; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff;",
            "background:#ff3e00; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff;",
            "background:transparent"
          );
        } else {
          const { type, message, file, filepath, code, errorName, start, stack } =
            JSON.parse(JSON.parse(event.data).message);

          const styles = document.createElement("style");
          styles.innerText = css;
          document.body.style.backgroundColor = "#181b1c";
          document.body.style.color = "#f9f7f4";
          document.title = `Snel ${type}`;
          document.head.appendChild(styles);

          console.error(code);
          console.error(stack);

          document.body.innerHTML = `
              <div style="margin: 40px; margin-left: 70px;">
                <h1 style="color: #e32945;">
                      ${errorName}
                </h1>
                <hr />
                <div>
                  <span>/${file.split("/").pop()}: ${message.toString()} ( ${
            start?.line
          }:${start?.column} )</span>
                  <br />
                </div>
                <br>
                <div>
                  <pre>
                    <code class="language-js" id="highlighting-content">${code}</code>
                  <pre>
                </div>
                <span span style="color: #ffff;">
                    View in vscode: <a href="vscode://file/${filepath}" style="color: #e32945; font-size: 18px; font-weight: bold; margin-top: 80px;">${file}</a>
                </span>
                <hr />
                <h4 style="color: #363e44; margin-top: 10px;">
                  This screen is visible only in development. It will not appear if the app crashes in production.
                  Open your browser’s developer console to further inspect this error.
                </h4>
                <div id="msg" style="display: none;">
                  <div style="background:transparent; text-aling: center;">
                    <span style="background:#35495e; padding: 5px; border-radius: 3px 0 0 3px;  color: #fff;">
                      🔥
                    </span>
                    <span style="background:#ff3e00; padding: 5px; border-radius: 0 3px 3px 0;  color: #fff;">
                      Recompiling
                    </span>
                  </div>
                </div>
              </div>`;

          function update(text) {
            Prism.plugins.NormalizeWhitespace.setDefaults({
              "remove-trailing": true,
              "remove-indent": true,
              "left-trim": true,
              "right-trim": true,
            });
            let result_element = document.querySelector(
              "#highlighting-content"
            );
            // Update code
            result_element.innerHTML = text;
            Prism.highlightElement(result_element);
          }

          update(code);
        }
      } catch (error) {}
    });
  } else {
    console.log(
      "%c Hot Reloading %c your browser not support websockets :( %c",
      "background:#35495e; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff;",
      "background:#ff3e00; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff;",
      "background:transparent;"
    );
  }
};
