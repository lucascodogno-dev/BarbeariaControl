import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Zap,
  Github,
  Linkedin,
  FileText,
  Layers,
  Database,
  Code2,
  Terminal,
  CheckCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react';
// Removed shadcn UI components - using regular HTML elements instead
// Helper function to conditionally join classNames (replacement for cn utility)
const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

const Portfolio = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [loading, setLoading] = useState(false); // Adicionado estado de loading
  const [error, setError] = useState(null); // Adicionado estado de erro

  // Refs para as seções para rolagem suave
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const experienceRef = useRef(null);
  const educationRef = useRef(null);
  const skillsRef = useRef(null);
  const contactRef = useRef(null);

  // Função para rolar para a seção
  const scrollToSection = useCallback((section, e) => {
    // Previne o comportamento padrão do link
    if (e) e.preventDefault();
    
    setIsMenuOpen(false); // Fecha o menu ao clicar em um link
    setActiveSection(section);

    let element = null;
    switch (section) {
      case 'home':
        element = homeRef.current;
        break;
      case 'about':
        element = aboutRef.current;
        break;
      case 'experience':
        element = experienceRef.current;
        break;
      case 'education':
        element = educationRef.current;
        break;
      case 'skills':
        element = skillsRef.current;
        break;
      case 'contact':
        element = contactRef.current;
        break;
      default:
        element = homeRef.current;
    }

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Dados do portfólio (você pode mover isso para um arquivo separado)
  const experienceData = [
    {
      company: 'Proxxi – IBM Brasil',
      title: 'Técnico de Campo',
      location: 'Birigui, SP, Brasil',
      date: 'Junho/2024 – Maio/2025',
      description: [
        'Responsável pelo suporte técnico de campo para infraestrutura e sistemas em clientes IBM, garantindo a operacionalidade e a segurança dos equipamentos.',
        'Atuação proativa na manutenção preventiva e corretiva de sistemas, com foco em segurança da informação.',
        'Colaboração eficaz com equipes remotas para resolução de incidentes e implementação de soluções IBM.',
      ],
    },
    {
      company: 'Mundial Editora',
      title: 'Desenvolvedor de Software',
      location: 'Birigui, SP, Brasil',
      date: '2019 – 2024',
      description: [
        'Desenvolvimento e manutenção de sistemas web utilizando as tecnologias React.js, Node.js e bancos de dados SQL, resultando em aplicações robustas e eficientes.',
        'Implementação de funcionalidades complexas utilizando Zustand para gerenciamento de estado, Socket.io para comunicação em tempo real e Firebase para serviços de backend.',
        'Criação de interfaces de usuário responsivas e intuitivas com HTML, CSS e JavaScript, assegurando uma excelente experiência do usuário em diversas plataformas.',
        'Identificação e resolução de problemas complexos, bem como otimização do desempenho de aplicações existentes, garantindo a escalabilidade e a eficiência dos sistemas.',
      ],
    },
  ];

  const educationData = [
    {
      institution: 'UNIVESP - Universidade Virtual do Estado de São Paulo',
      degree: 'Engenharia de Software – Bacharelado',
      date: 'Início: 2023 (Cursando – 3º ano)',
    },
    {
      institution: 'ETEC - Escola Técnica Estadual',
      degree: 'Tecnólogo em Radiologia',
      date: '2015 – 2018',
    },
  ];

  const skillsData = [
    {
      category: 'Desenvolvimento Frontend',
      items: ['React.js', 'Next.js', 'Zustand', 'HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'Desenvolvimento de interfaces responsivas'],
    },
    {
      category: 'Desenvolvimento Backend',
      items: ['Node.js', 'Socket.io', 'Desenvolvimento de APIs RESTful', 'Integração de sistemas'],
    },
    {
      category: 'Banco de Dados & DevOps',
      items: ['SQL Server', 'Firebase', 'Controle de versão (Git)', 'Autenticação e segurança'],
    },
    {
      category: 'Idiomas',
      items: ['Inglês: Intermediário (Comunicação técnica e conversação)'],
    },
  ];

  // Efeito para definir a seção ativa com base na rolagem
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Defina um pequeno offset para evitar trocas rápidas de seção
      const offset = windowHeight * 0.2;

      if (homeRef.current && scrollY < homeRef.current.offsetTop + offset) {
        setActiveSection('home');
      } else if (aboutRef.current && scrollY < aboutRef.current.offsetTop + offset) {
        setActiveSection('about');
      } else if (experienceRef.current && scrollY < experienceRef.current.offsetTop + offset) {
        setActiveSection('experience');
      } else if (educationRef.current && scrollY < educationRef.current.offsetTop + offset) {
        setActiveSection('education');
      } else if (skillsRef.current && scrollY < skillsRef.current.offsetTop + offset) {
        setActiveSection('skills');
      } else if (contactRef.current) {
        setActiveSection('contact');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <div className="bg-gray-950 text-gray-100 font-sans">
      {/* Barra de Navegação */}
      <nav className="bg-gray-900/90 backdrop-blur-md shadow-lg py-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between px-4">
          <a
            href="#"
            onClick={() => scrollToSection('home')}
            className="text-xl font-bold text-white hover:text-blue-400 transition-colors"
          >
            Lucas Codogno
          </a>
          <div className="hidden md:flex space-x-6">
            <a
              href="#"
              onClick={(e) => scrollToSection('home', e)}
              className={classNames(
                "text-gray-300 hover:text-white transition-colors",
                activeSection === 'home' && 'text-blue-400 font-semibold'
              )}
            >
              Home
            </a>
            <a
              href="#"
              onClick={(e) => scrollToSection('about', e)}
              className={classNames(
                "text-gray-300 hover:text-white transition-colors",
                activeSection === 'about' && 'text-blue-400 font-semibold'
              )}
            >
              Sobre
            </a>
            <a
              href="#"
              onClick={(e) => scrollToSection('experience', e)}
              className={classNames(
                "text-gray-300 hover:text-white transition-colors",
                activeSection === 'experience' && 'text-blue-400 font-semibold'
              )}
            >
              Experiência
            </a>
            <a
              href="#"
              onClick={(e) => scrollToSection('education', e)}
              className={classNames(
                "text-gray-300 hover:text-white transition-colors",
                activeSection === 'education' && 'text-blue-400 font-semibold'
              )}
              >
                Formação
            </a>
            <a
              href="#"
              onClick={(e) => scrollToSection('skills', e)}
              className={classNames(
                "text-gray-300 hover:text-white transition-colors",
                activeSection === 'skills' && 'text-blue-400 font-semibold'
              )}
            >
              Habilidades
            </a>
            <a
              href="#"
              onClick={(e) => scrollToSection('contact', e)}
              className={classNames(
                "text-gray-300 hover:text-white transition-colors",
                activeSection === 'contact' && 'text-blue-400 font-semibold'
              )}
            >
              Contato
            </a>
          </div>
          {/* Menu Hambúrguer para Mobile */}
          <div className="md:hidden">
                          <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-16 right-0 bg-gray-900/90 backdrop-blur-md shadow-lg rounded-md p-4 space-y-4 w-48"
                >
                  <a
                    href="#"
                    onClick={(e) => scrollToSection('home', e)}
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    Home
                  </a>
                  <a
                    href="#"
                    onClick={(e) => scrollToSection('about', e)}
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    Sobre
                  </a>
                  <a
                    href="#"
                    onClick={(e) => scrollToSection('experience', e)}
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    Experiência
                  </a>
                  <a
                    href="#"
                    onClick={(e) => scrollToSection('education', e)}
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    Formação
                  </a>
                  <a
                    href="#"
                    onClick={(e) => scrollToSection('skills', e)}
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    Habilidades
                  </a>
                  <a
                    href="#"
                    onClick={(e) => scrollToSection('contact', e)}
                    className="block text-gray-300 hover:text-white transition-colors"
                  >
                    Contato
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* Seção Home */}
      <section ref={homeRef} id="home" className="bg-gradient-to-br from-gray-900 to-blue-900 py-24 md:py-32 flex items-center justify-center">
        <div className="container mx-auto text-center px-4">
          <motion.img
            src="/lucas-codogno.jpg" // Substitua pelo caminho da sua foto
            alt="Lucas Codogno"
            className="rounded-full w-48 h-48 mx-auto mb-6 shadow-xl border-4 border-gray-800"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.3 }}
          >
            Lucas Rogério Correia Codogno
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.5 }}
          >
            Desenvolvedor de Software Full Stack
          </motion.p>
          <motion.div
            className="flex justify-center items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.7 }}
          >
            <a
              href="https://wa.me/5518991300406" // Substitua pelo seu número de WhatsApp
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              <Zap className="h-8 w-8" />
            </a>
            <a
              href="mailto:lucas.codogno@ibm.com" // Substitua pelo seu email da IBM
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              <Mail className="h-8 w-8" />
            </a>
             <a
              href="mailto:lucasrogeriocorreiacodogno@gmail.com"  // Substitua pelo seu email do gmail
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              <Mail className="h-8 w-8" />
            </a>
            <a
              href="https://www.linkedin.com/in/lucas-codogno/" // Substitua pelo seu perfil do LinkedIn
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Linkedin className="h-8 w-8" />
            </a>
            <a
              href="https://github.com/lucascodogno" // Substitua pelo seu perfil do GitHub
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors"
            >
              <Github className="h-8 w-8" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Seção Sobre */}
      <section ref={aboutRef} id="about" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-400">Sobre Mim</h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div
              className="md:w-1/3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              viewport={{ once: true }} // Garante que a animação ocorra apenas uma vez
            >
              <img
                src="/profile-image.jpeg" // Substitua pelo caminho da sua imagem de perfil
                alt="Sobre Mim"
                className="rounded-lg shadow-lg"
              />
            </motion.div>
            <motion.div
              className="md:w-2/3"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              viewport={{ once: true }}
            >
              <p className="text-gray-300 leading-relaxed text-lg">
                Desenvolvedor de software com experiência consolidada em um leque abrangente de tecnologias web modernas, incluindo React.js, Next.js, Node.js, TypeScript, Zustand e Firebase, além de proficiência em bancos de dados SQL. Minha atuação abrange o desenvolvimento full stack e o suporte técnico, alicerçada em um sólido conhecimento de arquiteturas web, sockets e integração de sistemas. Busco aprimoramento contínuo por meio da educação e certificações relevantes, complementado por uma comunicação eficaz em inglês.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Seção Experiência */}
      <section ref={experienceRef} id="experience" className="bg-gray-900 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-400">Experiência Profissional</h2>
          <div className="space-y-8">
            {experienceData.map((exp, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 rounded-lg shadow-md p-6 md:p-8 flex flex-col md:flex-row gap-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut', delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="md:w-1/4">
                  <h3 className="text-xl font-semibold text-white">{exp.company}</h3>
                  <p className="text-gray-400">{exp.title}</p>
                  <p className="text-gray-500 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {exp.location}
                  </p>
                  <p className="text-gray-500 flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {exp.date}
                  </p>
                </div>
                <div className="md:w-3/4">
                  {exp.description.map((desc, i) => (
                    <p key={i} className="text-gray-300 leading-relaxed mb-2">
                      {desc}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Formação */}
      <section ref={educationRef} id="education" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-400">Formação Acadêmica</h2>
          <div className="space-y-8">
            {educationData.map((edu, index) => (
              <motion.div
                key={index}
                className="bg-gray-800/80 backdrop-blur-md rounded-lg shadow-md p-6 md:p-8"
                 initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut', delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-semibold text-white">{edu.institution}</h3>
                <p className="text-gray-400 flex items-center gap-1">
                    <GraduationCap className="h-4 w-4"/>
                    {edu.degree}
                </p>
                <p className="text-gray-500">{edu.date}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

        {/* Seção Habilidades */}
        <section ref={skillsRef} id="skills" className="bg-gray-900 py-16 md:py-24">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8 text-center text-blue-400">Habilidades Técnicas</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {skillsData.map((skill, index) => (
                        <motion.div
                            key={index}
                            className="bg-gray-800/80 backdrop-blur-md rounded-lg shadow-md p-6"
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, ease: 'easeInOut', delay: index * 0.15 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-xl font-semibold mb-4 text-white">{skill.category}</h3>
                            <div className="flex flex-wrap gap-2">
                                {skill.items.map((item, i) => (
                                    <span
                                        key={i}
                                        className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors"
                                    >
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

      {/* Seção Contato */}
      <section ref={contactRef} id="contact" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-400">Contato</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <motion.div
                className="md:w-1/2"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                viewport={{ once: true }}
            >
                <p className="text-gray-300 leading-relaxed text-lg mb-4">
                Sinta-se à vontade para entrar em contato comigo para oportunidades de trabalho, colaborações ou apenas para dizer olá!
                </p>
                <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Zap className="h-6 w-6 text-green-400" />
                    <span className="text-gray-300">
                    <a
                        href="https://wa.me/5518991300406"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-green-300 transition-colors"
                    >
                        (18) 99130-0406
                    </a>
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Mail className="h-6 w-6 text-red-400" />
                    <span className="text-gray-300">
                    <a
                        href="mailto:lucas.codogno@ibm.com"
                        className="hover:text-red-300 transition-colors"
                    >
                        lucas.codogno@ibm.com
                    </a>
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Mail className="h-6 w-6 text-red-400" />
                    <span className="text-gray-300">
                    <a
                        href="mailto:lucasrogeriocorreiacodogno@gmail.com"
                        className="hover:text-red-300 transition-colors"
                    >
                        lucasrogeriocorreiacodogno@gmail.com
                    </a>
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-blue-400" />
                    <span className="text-gray-300">Birigui – SP, Brasil</span>
                </div>
                <div className="flex items-center gap-2">
                    <Linkedin className="h-6 w-6 text-blue-400"/>
                    <a
                        href="https://www.linkedin.com/in/lucas-codogno/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-300 transition-colors"
                    >
                         /lucas-codogno
                    </a>
                </div>
                <div className="flex items-center gap-2">
                    <Github className="h-6 w-6 text-gray-300" />
                    <a
                        href="https://github.com/lucascodogno"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors"
                    >
                        /lucascodogno
                    </a>
                </div>
                </div>
            </motion.div>
            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              viewport={{ once: true }}
            >
              <div className="bg-gray-800/80 backdrop-blur-md shadow-lg rounded-lg overflow-hidden">
                <div className="p-6 border-b border-gray-700">
                  <h3 className="text-xl font-semibold text-white">Enviar Mensagem</h3>
                  <p className="text-gray-400 mt-1">
                    Preencha o formulário abaixo e entrarei em contato o mais breve possível.
                  </p>
                </div>
                <div className="p-6">
                  <form
                    className="space-y-6"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setLoading(true); // Inicia o loading
                      setError(null);    // Limpa qualquer erro anterior

                      // Simula um envio de formulário com um timeout
                      setTimeout(() => {
                        setLoading(false); // Finaliza o loading
                        // Simulação de sucesso (você deve substituir por lógica real de envio)
                        alert('Mensagem enviada com sucesso! (Simulado)');
                        // Se houver um erro, você pode usar:
                        // setError('Ocorreu um erro ao enviar a mensagem.');
                      }, 2000); // Simula um delay de 2 segundos
                    }}
                  >
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-200">Nome</label>
                      <input
                        type="text"
                        id="name"
                        placeholder="Seu Nome"
                        className="mt-1 p-2 w-full rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email</label>
                      <input
                        type="email"
                        id="email"
                        placeholder="seuemail@exemplo.com"
                        className="mt-1 p-2 w-full rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-200">Mensagem</label>
                      <textarea
                        id="message"
                        placeholder="Sua Mensagem..."
                        className="mt-1 p-2 w-full rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                        required
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300"
                      disabled={loading} // Desabilita o botão durante o loading
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        "Enviar Mensagem"
                      )}
                    </button>
                    {error && (
                      <div className="text-red-500 text-sm flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4" />
                        {error}
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="bg-gray-900 text-gray-400 py-6 text-center border-t border-gray-800">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} Lucas Rogério Correia Codogno. Todos os direitos reservados.</p>
           <div className="mt-4 flex justify-center items-center gap-4">
            <a
              href="https://wa.me/5518991300406" // Substitua pelo seu número de WhatsApp
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              <Zap className="h-6 w-6" />
            </a>
            <a
              href="mailto:lucas.codogno@ibm.com" // Substitua pelo seu email da IBM
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              <Mail className="h-6 w-6" />
            </a>
             <a
              href="mailto:lucasrogeriocorreiacodogno@gmail.com"  // Substitua pelo seu email do gmail
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              <Mail className="h-6 w-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/lucas-codogno/" // Substitua pelo seu perfil do LinkedIn
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Linkedin className="h-6 w-6" />
            </a>
            <a
              href="https://github.com/lucascodogno" // Substitua pelo seu perfil do GitHub
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors"
            >
              <Github className="h-6 w-6" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;