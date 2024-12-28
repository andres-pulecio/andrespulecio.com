function contactLinks(e, chassisBody) {
    if (e.type !== 'keydown' && e.type !== 'keyup') return;
    const keyup = e.type === 'keyup';

    const mixMailPositionX = -15;
    const mixMailPositionZ = 162;
    const squMailTrig = 3;
    if (e.keyCode === 13 && chassisBody.position.x < (mixMailPositionX + squMailTrig) && chassisBody.position.x > (mixMailPositionX - squMailTrig) && chassisBody.position.z < (mixMailPositionZ + squMailTrig) && chassisBody.position.z > (mixMailPositionZ - squMailTrig)) {
        window.open('mailto:andresfelipepulecio@gmail.com', '_blank').focus();
    }

    const mixLinkPositionX = -24;
    const mixLinkPositionZ = 162;
    const squLinkTrig = 3;
    if (e.keyCode === 13 && chassisBody.position.x < (mixLinkPositionX + squLinkTrig) && chassisBody.position.x > (mixLinkPositionX - squLinkTrig) && chassisBody.position.z < (mixLinkPositionZ + squLinkTrig) && chassisBody.position.z > (mixLinkPositionZ - squLinkTrig)) {
        window.open('https://www.linkedin.com/in/andres-pulecio/', '_blank').focus();
    }

    const mixGitPositionX = -33;
    const mixGitPositionZ = 162;
    const squGitTrig = 3;
    if (e.keyCode === 13 && chassisBody.position.x < (mixGitPositionX + squGitTrig) && chassisBody.position.x > (mixGitPositionX - squGitTrig) && chassisBody.position.z < (mixGitPositionZ + squGitTrig) && chassisBody.position.z > (mixGitPositionZ - squGitTrig)) {
        window.open('https://github.com/andres-pulecio', '_blank').focus();
    }
}

export default contactLinks;
