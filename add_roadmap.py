with open('aion-static/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

roadmap_html = '''                    <!-- Roadmap -->
                    <div class="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-xl">
                        <h2 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <i data-lucide="map" class="h-5 w-5 text-red-500"></i>
                            Roadmap
                        </h2>
                        <div class="space-y-3">
                            <div class="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                <span class="text-2xl">✅</span>
                                <div class="flex-1">
                                    <div class="text-white font-semibold text-sm">Phase 1 - MVP</div>
                                    <div class="text-gray-400 text-xs">Marketplace, Leaderboard, Wallet, DAO</div>
                                </div>
                            </div>
                            <div class="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                                <span class="text-2xl">🔄</span>
                                <div class="flex-1">
                                    <div class="text-white font-semibold text-sm">Phase 2 - Alpha (68%)</div>
                                    <div class="text-gray-400 text-xs">Linera Integration, Testnet</div>
                                </div>
                            </div>
                            <div class="flex items-start gap-3 p-3 bg-white/5 border border-white/10 rounded-lg opacity-50">
                                <span class="text-2xl">🔒</span>
                                <div class="flex-1">
                                    <div class="text-white font-semibold text-sm">Phase 3 - Beta</div>
                                    <div class="text-gray-400 text-xs">Fusion Hub, Dispute Resolution</div>
                                </div>
                            </div>
                            <div class="flex items-start gap-3 p-3 bg-white/5 border border-white/10 rounded-lg opacity-50">
                                <span class="text-2xl">🔒</span>
                                <div class="flex-1">
                                    <div class="text-white font-semibold text-sm">Phase 4 - Mainnet</div>
                                    <div class="text-gray-400 text-xs">Security Audit, Token Launch</div>
                                </div>
                            </div>
                        </div>
                    </div>
'''

marker = '                    <!-- Quick Actions -->'
pos = content.find(marker)
if pos != -1:
    insert_pos = content.find('                    </div>\n                </div>', pos)
    if insert_pos != -1:
        content = content[:insert_pos] + '                    </div>\n\n' + roadmap_html + '\n                </div>'  + content[insert_pos + 51:]

with open('aion-static/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Roadmap added successfully')
