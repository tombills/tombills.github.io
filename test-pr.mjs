const body = `<!-- -->

Thanks for creating a pull request to request a new subdomain from JS.ORG

- [x] There is reasonable content on the page (see: [No Content](https://github.com/js-org/js.org/wiki/No-Content))
- [x] I have read and accepted the [Terms and Conditions](http://js.org/terms.html)
- The site content can be seen at <https://tombills.github.io>

> The site content is a portfolio website showcasing real-world JavaScript projects including WeChat mini-program e-commerce development, vanilla JS web applications, DOM manipulation, state management, API integration, and automation scripting workflows.
. It is relevant to JavaScript developers specifically because the site demonstrates practical applied JavaScript skills across multiple production contexts including e-commerce frontends, O2O service platforms, and developer tooling, serving as a reference implementation of JS-first static architecture.
`;

const failures = [];

const reasonableContent = /^[ \t]*-[ \t]+\[x\].*?There is reasonable content on the page/im.test(body);
if (!reasonableContent) failures.push("Reasonable content checkbox is not checked.");

const termsAndConditions = /^[ \t]*-[ \t]+\[x\].*?I have read and accepted the \[Terms and Conditions\]/im.test(body);
if (!termsAndConditions) failures.push("Terms and conditions checkbox is not checked.");

const url = /^[ \t]*-[ \t]*The site content can be seen at[ \t]+(?:<)?(?:\[.*?\]\()?https?:\/\/[^\s>()]+(?:\))?(?:>)?/im.exec(body);
if (!url) failures.push("Content URL is missing or not in the correct format.");

const explanation = />\s*The site content is(?:\s*|\s*\n)(.+)(?:\s*|\s*\n)(?:and(?: it)?|\. It) is relevant to JavaScript developers specifically because(?:\s*|\s*\n)(.+)/i.exec(body);
if (!explanation || explanation[1].trim().length <= 10 || explanation[2].trim().length <= 10) failures.push("Content explanation is missing or too short.");

if (failures.length) {
  console.log("FAILED:");
  failures.forEach(f => console.log("  - " + f));
} else {
  console.log("PR description format is valid.");
}
