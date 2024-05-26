class ProposalPage {
    constructor(isAdmin = false, memberId = 192192) {
        this.isAdmin = isAdmin;
        this.memberId = memberId;
        this.page = document.createElement('div');
        this.page.className = 'proposal-page';

        // 제안 폼 추가
        const proposalForm = new ProposalForm(isAdmin, memberId);
        this.page.appendChild(proposalForm.render());

        if (this.isAdmin) {
            // 관리자일 경우 예시 게시물 추가
            const postDiv = document.createElement('div');
            postDiv.className = 'memo-box';
            postDiv.id = 'post_192192';
            postDiv.textContent = '무궁화꽃이피었습니다는...\n친구가없으면..\n못하는건가요..?';
            this.page.appendChild(postDiv);
        } else {
            // 사용자의 게시물만 표시
            const userPosts = this.getUserPosts(memberId);
            userPosts.forEach(post => {
                const postDiv = document.createElement('div');
                postDiv.className = 'memo-box';
                postDiv.id = `post_${post.id}`;
                postDiv.textContent = post.content;
                this.page.appendChild(postDiv);
            });
        }
    }

    // 사용자의 게시물 가져오기
    getUserPosts(memberId) {
        // 실제 데이터 가져오는 로직으로 대체되어야 함
        const allPosts = [
            { id: 192192, userId: 192192, content: '무궁화꽃이피었습니다는...\n친구가없으면..\n못하는건가요..?' },
        ];

        return allPosts.filter(post => post.userId === memberId);
    }

    // 페이지 렌더링
    render() {
        return this.page;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const isAdmin = false;
    const memberId = 192192;

    const app = document.getElementById('app');
    const proposalPage = new ProposalPage(isAdmin, memberId);
    app.appendChild(proposalPage.render());
});
