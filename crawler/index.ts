import { PlaywrightCrawler, Dataset } from "crawlee";

interface PageData {
  title: string;
  url: string;
  textContent: string;
  headings: Array<{ level: number; text: string; id: string | null }>;
  linkElements: Array<{ text: string; href: string }>;
  inputElements: Array<{
    type: string;
    text: string;
    placeholder: string | null;
  }>;
  buttonElements: Array<{ type: string; text: string }>;
  formElements: Array<{ type: string; text: string }>;
  interactiveElements: Array<{
    type: string;
    text: string;
    id: string | null;
  }>;
}

function formatForLLM(data: PageData): string {
  let formatted = `# ${data.title}\n\n`;
  formatted += `**URL:** ${data.url}\n\n`;

  // Add page structure overview
  if (data.headings.length > 0) {
    formatted += `## Page Structure\n\n`;
    data.headings.forEach((heading) => {
      const indent = "  ".repeat(heading.level - 1);
      formatted += `${indent}- ${heading.text}\n`;
    });
    formatted += `\n`;
  }

  // Add navigation context
  if (data.linkElements.length > 0) {
    formatted += `## Available Navigation\n\n`;
    data.linkElements.forEach((nav) => {
      if (nav.text) {
        formatted += `- ${nav.text}: ${nav.href}\n`;
      }
    });
    formatted += `\n`;
  }

  // Add interactive elements (crucial for tutorial generation)
  if (data.interactiveElements.length > 0) {
    formatted += `## Interactive Elements\n\n`;
    data.interactiveElements.forEach((element) => {
      if (element.text) {
        formatted += `- **${element.type.toUpperCase()}**: "${element.text}"`;
        if (element.id) formatted += ` (ID: ${element.id})`;
        formatted += `\n`;
      }
    });
    formatted += `\n`;
  }

  // Add input elements
  if (data.inputElements.length > 0) {
    formatted += `## Input Elements\n\n`;
    data.inputElements.forEach((inputElement) => {
      formatted += `- **${inputElement.type.toUpperCase()}**: "${
        inputElement.placeholder ? `"${inputElement.placeholder}"` : ""
      } ${inputElement.text}"\n`;
    });
  }

  // Add button elements
  if (data.buttonElements.length > 0) {
    formatted += `## Button Elements\n\n`;
    data.buttonElements.forEach((buttonElement) => {
      formatted += `- **${buttonElement.type.toUpperCase()}**: "${
        buttonElement.text
      }"\n`;
    });
  }

  // Add form elements
  if (data.formElements.length > 0) {
    formatted += `## Form Elements\n\n`;
    data.formElements.forEach((formElement) => {
      formatted += `- **${formElement.type.toUpperCase()}**: "${
        formElement.text
      }"\n`;
    });
  }
  // Add main content
  formatted += `## Page Content\n\n`;
  formatted += data.textContent;

  return formatted;
}

async function main() {
  const crawler = new PlaywrightCrawler({
    async requestHandler({ request, page, enqueueLinks, log }) {
      // Skip pages that match the pattern https://qrticket.app/e/...
      if (request.loadedUrl && request.loadedUrl.includes("/e/")) {
        log.info(`Skipping event page: ${request.loadedUrl}`);
        return;
      }

      const title = await page.title();
      log.info(`Title of ${request.loadedUrl} is '${title}'`);

      // Wait for page to be fully loaded
      await page.waitForLoadState("networkidle");

      // Extract comprehensive page content for LLM processing
      const pageData = await page.evaluate(() => {
        // Remove non-semantic elements
        const elementsToRemove = document.querySelectorAll(
          "script, style, noscript, svg, img, br, hr, canvas, video, audio, picture, source, next-route-announcer"
        );
        elementsToRemove.forEach((el) => el.remove());

        // Remove HTML comments
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_COMMENT,
          null
        );
        const comments = [];
        let node;
        while ((node = walker.nextNode())) {
          comments.push(node);
        }
        comments.forEach((comment) => {
          if (comment.parentNode) {
            comment.parentNode.removeChild(comment);
          }
        });

        // Clean attributes
        const elements = document.querySelectorAll("*");
        elements.forEach((el) => {
          // Remove all data-* attributes
          Array.from(el.attributes).forEach((attr) => {
            if (attr.name.startsWith("data-")) {
              el.removeAttribute(attr.name);
            }
          });

          // Remove presentation/styling attributes
          const attributesToRemove = [
            "class",
            "style",
            "tabindex",
            "aria-expanded",
            "aria-selected",
            "aria-haspopup",
            "aria-atomic",
            "aria-live",
            "aria-relevant",
            "target",
            "rel",
            "spellcheck",
            "draggable",
            "contenteditable",
            "aria-label",
          ];

          attributesToRemove.forEach((attr) => el.removeAttribute(attr));
        });

        // Remove empty elements (but preserve semantic structure)
        const emptyElements = document.querySelectorAll(
          "div:empty, span:empty, p:empty"
        );
        emptyElements.forEach((el) => {
          // Only remove if it's truly empty and has no meaningful attributes
          if (!el.id && !el.hasAttribute("href") && !el.hasAttribute("type")) {
            el.remove();
          }
        });

        // Simplify nested empty containers
        const containers = document.querySelectorAll("div, span");
        containers.forEach((container) => {
          const hasOnlyEmptyChildren = Array.from(container.children).every(
            (child) =>
              (child.tagName === "DIV" || child.tagName === "SPAN") &&
              (child.textContent?.trim() || "") === "" &&
              !child.hasAttribute("href") &&
              !child.hasAttribute("type")
          );

          if (
            hasOnlyEmptyChildren &&
            (container.textContent?.trim() || "") === ""
          ) {
            container.remove();
          }
        });

        const html = document.body.innerHTML;

        return {
          html,
        };
      });

      await Dataset.pushData({
        title,
        url: request.loadedUrl,
        timestamp: new Date().toISOString(),
        html: pageData.html,
      });

      await enqueueLinks({
        exclude: [/https:\/\/qrticket\.app\/e\//],
      });
    },
    // headless: false,

    maxRequestsPerCrawl: 100,
    sameDomainDelaySecs: 2,
    preNavigationHooks: [
      async (crawlingContext) => {
        crawlingContext.page.context().addCookies([
          {
            name: "__Secure-authjs.session-token",
            value:
              "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoiNTNKcmIzUFFtTzhTSHI2UE1hcVdHY3pZMFdpZHcwZm1VRVZDbnQtYUJmQ3NJQXVudWl2QTRrLWJVY2NuaEZXSUlPWEtEbzNHRllmRE1zdzE1YWJEblEifQ..L0B5myaeg7mrQG83oxyzxw.OHlB-1v5jCS_ERPsz6LnEVYjL6cBNDK2o3CJ4RWwZMh0OsojEiwe0YT1rjLBhsFRCzqDjl2M1-5CDeYmkaMgAqnx5xbCuz3RiaE42xcEOrFyltbj_-5ExDxSXpc8AnH--O_L4oWS30pMZxfOv9m-kZ7Kq1FnSQsf-PHulXtVYtmPhzi3sC2kjGQ4Pxk38WNNQ5vdtnA5AbklhMJUV9fca2fd85pTQ2t81Gig4MzKEDM1OImy5CJL3saKtRSZ-K1nezhJVau18ZBunIjHaoZxYg.Kn_YxgoJYSSbMme0pDb1iHu-nSroILQHxpLuL0xbIpM",
            url: "https://qrticket.app",
          },
        ]);
      },
    ],
  });

  // Add first URL to the queue and start the crawl.
  await crawler.run(["https://qrticket.app/dashboard"]);
}

main();
