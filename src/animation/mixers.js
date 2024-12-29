function mixers(mixerButterfly, clockButterfly, mixerMail, clockMail, chassisBody, mailAnimationMesh, mixerLinkedin, clockLinkedin, linkedinAnimationMesh, mixerGithub, githubAnimationMesh) {
    if (mixerButterfly) {
        mixerButterfly.update(clockButterfly.getDelta());
    }
    
    const mixMailPositionX = -15;
    const mixMailPositionZ = 162;
    const squMailTrig = 3;

    if (mixerMail && chassisBody.position.x < (mixMailPositionX + squMailTrig) && chassisBody.position.x > (mixMailPositionX - squMailTrig) && chassisBody.position.z < (mixMailPositionZ + squMailTrig) && chassisBody.position.z > (mixMailPositionZ - squMailTrig)) {
        mixerMail.update(clockMail.getDelta());
        mailAnimationMesh.position.set(mixMailPositionX, 0, mixMailPositionZ);
    } else {
        mailAnimationMesh.position.set(mixMailPositionX, -10, mixMailPositionZ);
    }

    const mixLinkPositionX = -24;
    const mixLinkPositionZ = 162;
    const squLinkTrig = 3;

    if (mixerLinkedin && chassisBody.position.x < (mixLinkPositionX + squLinkTrig) && chassisBody.position.x > (mixLinkPositionX - squLinkTrig) && chassisBody.position.z < (mixLinkPositionZ + squLinkTrig) && chassisBody.position.z > (mixLinkPositionZ - squLinkTrig)) {
        mixerLinkedin.update(clockLinkedin.getDelta());
        linkedinAnimationMesh.position.set(mixLinkPositionX, 0, mixLinkPositionZ);
    } else {
        linkedinAnimationMesh.position.set(mixLinkPositionX, -10, mixLinkPositionZ);
    }

    const mixGitPositionX = -33;
    const mixGitPositionZ = 162;
    const squGitTrig = 3;

    if (mixerGithub && chassisBody.position.x < (mixGitPositionX + squGitTrig) && chassisBody.position.x > (mixGitPositionX - squGitTrig) && chassisBody.position.z < (mixGitPositionZ + squGitTrig) && chassisBody.position.z > (mixGitPositionZ - squGitTrig)) {
        mixerGithub.update(clockLinkedin.getDelta());
        githubAnimationMesh.position.set(mixGitPositionX, 0, mixGitPositionZ);
    } else {
        githubAnimationMesh.position.set(mixGitPositionX, -10, mixGitPositionZ);
    }
}

export default mixers;
