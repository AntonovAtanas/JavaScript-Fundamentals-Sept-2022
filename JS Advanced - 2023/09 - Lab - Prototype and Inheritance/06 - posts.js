function solution() {

    class Post {
        constructor(title, content) {
            this.title = title;
            this.content = content;
        };

        toString() {
            return `Post: ${this.title}\nContent: ${this.content}`
        };
    };

    class SocialMediaPost extends Post {
        constructor(title, content, likes, dislikes) {
            super(title, content);
            this.likes = likes;
            this.dislikes = dislikes;
            this.comments = [];
        };
        addComment(text) {
            this.comments.push(text);
        };
        toString() {
            if (this.comments.length === 0) {
                return `${super.toString()}\nRating: ${this.likes - this.dislikes}`;
            } else {
                return `${super.toString()}\nRating: ${this.likes - this.dislikes}\nComments: \n* ${this.comments.join('\n* ')}`;
            }
        };
    };

    class BlogPost extends Post {
        constructor(title, content, views) {
            super(title, content);
            this.views = views;
        };
        view() {
            this.views++;
            return this;
        };
        toString() {
            return `${super.toString()}\nViews: ${this.views}`;
        };
    }
    return { Post, SocialMediaPost, BlogPost }
}

const classes = solution();

let post = new classes.Post("Post", "Content");

console.log(post.toString());

// Post: Post

// Content: Content

let scm = new classes.SocialMediaPost("TestTitle", "TestContent", 25, 30);

scm.addComment("Good post");

scm.addComment("Very good post");

scm.addComment("Wow!");

console.log(scm.toString());

// Post: TestTitle

// Content: TestContent

// Rating: -5

// Comments:

// * Good post

// * Very good post

// * Wow