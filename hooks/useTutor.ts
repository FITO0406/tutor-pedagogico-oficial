'use client';

import { useState, useEffect, useCallback } from 'react';
import * as webllm from '@mlc-ai/web-llm';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export function useTutor() {
  const [engine, setEngine] = useState<webllm.MLCEngineInterface | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [status, setStatus] = useState<string>('');
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // El modelo SmolLM es muy pequeño (~200MB) y rápido para navegadores
  const selectedModel = 'SmolLM-135M-Instruct-v0.2-q4f16_1-MLC';

  const initEngine = useCallback(async () => {
    if (engine || isInitializing) return;

    try {
      setIsInitializing(true);
      setError(null);
      
      const newEngine = new webllm.MLCEngine();
      
      newEngine.setInitProgressCallback((report: webllm.InitProgressReport) => {
        setLoadingProgress(Math.round(report.progress * 100));
        setStatus(report.text);
      });

      await newEngine.reload(selectedModel);
      setEngine(newEngine);
      setIsInitializing(false);
      setStatus('Tutor listo');
    } catch (err: any) {
      console.error('Error al inicializar WebLLM:', err);
      setError(err.message || 'Error al cargar el motor de IA local');
      setIsInitializing(false);
    }
  }, [engine, isInitializing]);

  const generateResponse = async (messages: Message[]) => {
    if (!engine) {
      throw new Error('El motor de IA no está inicializado');
    }

    try {
      const chunks = await engine.chat.completions.create({
        messages: messages as any,
        stream: true,
      });

      return chunks;
    } catch (err: any) {
      console.error('Error en generación:', err);
      throw err;
    }
  };

  return {
    engine,
    loadingProgress,
    status,
    isInitializing,
    error,
    initEngine,
    generateResponse,
  };
}
