/* 
Taken from  protvista-feature-adapter/src/BasicHelper.js
and adapted slightly
*/

export const formatSource = source => {
  return source.name.toLowerCase() === "PubMed".toLowerCase()
    ? `${source.id}&nbsp;(<a href='${source.url}' style="color:#FFF" target='_blank'>${source.name}</a>&nbsp;<a href='${source.alternativeUrl}' style="color:#FFF" target='_blank'>EuropePMC</a>)`
    : `&nbsp;<a href='${source.url}' style="color:#FFF" target='_blank'>${source.id.slice(0, 5)}...</a>&nbsp;(${source.name})`;
};

export const getEvidenceFromCodes = evidenceList => {
    if (!evidenceList) return ``;
    return `
        <ul>${evidenceList
          .map(ev => {
            return `<li title='${
              ev.code
            }' style="padding: .25rem 0">${ev.code}:&nbsp;${
              ev.source ? formatSource(ev.source) : ""
            }</li>`;
          })
          .join("")}</ul>
      `;
  };