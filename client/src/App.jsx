import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

// Placeholder imports – replace with your actual assets
import send from './assets/send.svg';
import user from './assets/user.png';
import loadingIcon from './assets/loader.svg';
import bot from './assets/bot.png';

function App() {
  const [input, setInput] = useState('');
  const [posts, setPosts] = useState([]);
  const layoutRef = useRef(null);

  // Auto-scroll to bottom on new posts
  useEffect(() => {
    if (layoutRef.current) {
      layoutRef.current.scrollTop = layoutRef.current.scrollHeight;
    }
  }, [posts]);

  const fetchBotResponse = async () => {
    const { data } = await axios.post(
      "https://eighty-goats-teach.loca.lt", 
      { input },
      {
        headers: {
          "Content-Type": "application/json",
          "bypass-tunnel-reminder": "true", 
        },
      }
    );
    return data;
  };

  const onSubmit = () => {
    if (input.trim() === '') return;
    updatePosts(input, false, false);
    updatePosts('loading...', false, true);
    setInput('');
    fetchBotResponse().then((res) => {
      console.log(res);
      updatePosts(res.bot.trim(), true, false);
    });
  };

  const autoTypingBotResponse = (text) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setPosts((prevState) => {
          const newPosts = [...prevState];
          const lastItem = newPosts.pop();
          if (lastItem.type !== 'bot') {
            newPosts.push({
              type: 'bot',
              post: text.charAt(index - 1),
            });
          } else {
            newPosts.push({
              type: 'bot',
              post: lastItem.post + text.charAt(index - 1),
            });
          }
          return newPosts;
        });
        index++;
      } else {
        clearInterval(interval);
      }
    }, 30);
  };

  const updatePosts = (post, isBot, isLoading) => {
    if (isBot) {
      autoTypingBotResponse(post);
    } else {
      setPosts((prevState) => {
        return [...prevState, { type: isLoading ? 'loading' : 'user', post }];
      });
    }
  };

  const onKeyUp = (e) => {
    if (e.key === 'Enter' || e.which === 13) {
      onSubmit();
    }
  };

  return (
    <main className="app">
      <div className="chat-container">
        {/* Header */}
        <header className="chat-header">
          <div className="header-content">
            <div className="bot-avatar">
              <img src={bot} alt="Bot" />
            </div>
            <div className="header-info">
              <h1>AI Assistant</h1>
              <p>Online • Ready to help</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-btn">⚡</button>
            <button className="icon-btn">⋮</button>
          </div>
        </header>

        {/* Messages */}
        <div className="layout" ref={layoutRef}>
          {posts.map((post, index) => (
            <div
              key={index}
              className={`message ${post.type === 'bot' || post.type === 'loading' ? 'bot' : 'user'}`}
            >
              <div className="avatar">
                <img
                  src={
                    post.type === 'bot' || post.type === 'loading' ? bot : user
                  }
                  alt="Avatar"
                />
              </div>
              {/* <div className="bubble"> */}
              <div>
                {post.type === 'loading' ? (
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                ) : (
                  <div className="post">{post.post}</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer / Input */}
        <footer className="input-area">
          <div className="input-wrapper">
            <input
              value={input}
              className="composebar"
              autoFocus
              type="text"
              placeholder="Ask me anything..."
              onChange={(e) => setInput(e.target.value)}
              onKeyUp={onKeyUp}
            />
            <button className="send-button" onClick={onSubmit}>
              <img src={send} alt="Send" />
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
}

export default App;