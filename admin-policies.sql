-- ================================================
-- EXECUTE ESTE SQL NO SUPABASE TAMBÉM
-- Adiciona acesso total para o admin
-- ================================================

-- Admin bypass: pode ver e editar TODAS as oficinas
create policy "admin_bypass_oficinas" on public.oficinas
  for all using (auth.jwt() ->> 'email' = 'admin@oficinapro.com.br');

-- Admin bypass: pode ver e editar TODOS os veículos
create policy "admin_bypass_veiculos" on public.veiculos
  for all using (auth.jwt() ->> 'email' = 'admin@oficinapro.com.br');

-- Admin bypass: pode ver e editar TODOS os serviços
create policy "admin_bypass_servicos" on public.servicos
  for all using (auth.jwt() ->> 'email' = 'admin@oficinapro.com.br');
